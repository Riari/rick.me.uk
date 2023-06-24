+++
title = "Route Model Binding Alternatives in Laravel"
slug = "route-model-binding-alternatives-in-laravel"
description = "A middleware-based approach to route parameter resolution."
date = "2023-06-23"
tags = ["web", "php", "frameworks", "laravel"]
image = "/images/post-headers/pixellated-code.png"
+++

[Route model binding](https://laravel.com/docs/10.x/routing#route-model-binding) is a feature in the Laravel PHP framework that allows you to bind a route parameter to an Eloquent (ORM) model. It's a way of automatically injecting model instances into controller actions by resolving route parameter values in URIs. This allows a URI path like `/users/1` to map to a controller action receiving a model instance for user ID 1 without requiring any lookups for that user to be done in the controller.

Binding can be achieved in one of two ways: implicitly or explicitly. Implicit binding works by automatically matching a parameter to a type-hinted parameter in a controller action, while explicit binding works by specifying how to map a parameter name to a model (using [`Route::model`](https://laravel.com/api/10.x/Illuminate/Routing/Router.html#method_model)) or providing custom resolution logic (using [`Route::bind`](https://laravel.com/api/10.x/Illuminate/Routing/Router.html#method_bind)). Examples of both approaches are given in [the docs](https://laravel.com/docs/10.x/routing#route-model-binding).

### The problem

While this is a convenient feature that can help reduce the burden on controllers (and perhaps form requests, depending on your application) to resolve dependencies, it has a few drawbacks.

The first is that implicit binding is highly abstract (to the point of being considered 'magic'): the link between the substring corresponding to the model in the route pattern and the model instance received by the controller action is extremely tenuous, and without knowing about this feature in the first place, it may be very difficult to understand the behaviour.

The second is that even with explicit binding (which goes some way towards mitigating the above issue), bindings are not scoped or namespaced in any way; they're globally registered on the router and the router will attempt to apply them to every single route registered in your app (even the ones that don't contain the corresponding parameters, which is probably most of them). This is especially an issue when using the feature in a package, because packages can't know or presume anything about the routes that might be registered in the host application, which can in turn lead to conflicts when resolving parameters with name collisions—but it's also an issue for routes defined in an application, because a package with conflicting parameter names may be introduced later and cause issues (although unlikely).

One way to mitigate that second issue is to choose very specific parameter names that are not likely to clash. This approximates some kind of namespacing mechanism, but it's crude and not a guarantee. So what's the solution?

The route model binding feature could probably be improved through PRs. I'm not sure exactly what form improvements should take, but they would probably include a way of scoping bindings to a subset of routes by substring matching (e.g. "all routes beginning with /user") or matching route names using wildcards. Taking one of the explicit binding examples from the docs and imagining how the syntax might be improved, it could look like this:

{{<highlight php "linenos=false">}}
// Assuming all user routes are named with the `user.*` pattern
Route::model('user', User::class)->on('users.*');
{{</highlight>}}

But even that wouldn't be ideal, because it would require its own validation or error handling (what should happen if the route matching doesn't actually match any defined routes?) and adds complexity to an already complex router.

In fairness, I don't think the problems I've described in this post are by any means common. I've used route model binding in numerous projects without trouble. But that doesn't eliminate the possibility of it leading to problems further down the line—potentially ones that aren't very easy to debug.

### The solution

One of the issues I mentioned above is the potential for conflicts between multiple bindings for the same parameter name. I encountered this exact problem in a package I maintain some months ago, and ultimately decided to replace all usages of route model binding with a [custom middleware solution](https://github.com/Team-Tea-Time/laravel-forum/pull/322). This makes a lot of sense for many reasons:

* It leverages another existing feature of the framework
* It provides an intuitive place to contain all of your binding logic
* It removes the responsibility of managing bindings from your router calls, so they can deal exclusively with defining routes and their groups
* Middleware can be applied as granularly as required, so you get the ability to scope your bindings for free
* It's barely any more effort to implement or maintain than explicit binding

Here's an example of how a general-purpose implementation might look for resolving parameters in web routes:

{{<highlight php "linenos=table">}}
<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;

class ResolveWebParameters
{
    public function handle(Request $request, Closure $next)
    {
        $parameters = $request->route()->parameters();

        if (array_key_exists('user', $parameters)) {
            $user = User::findOrFail($parameters['user']);
            $request->route()->setParameter('user', $user);
        }

        // Resolve more parameters as needed

        return $next($request);
    }
}
{{</highlight>}}

If that's too generalised for your case, or you simply don't want to define all of your bindings in one big list, you could divide the middleware up based on model, route group, or anything else that makes sense for your situation.

It's also worth mentioning that if your project is simple enough to only need a handful of model lookups for a small set of routes, receiving the raw parameter values in your controller actions and manually performing the lookups in them is an acceptable solution, but the middleware approach is a scaleable alternative worth considering.