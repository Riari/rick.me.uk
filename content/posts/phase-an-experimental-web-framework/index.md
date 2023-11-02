+++
title = "Phase: An Experimental Web Framework"
slug = "phase-an-experimental-web-framework"
description = "Is there a better alternative to the classic web framework?"
date = "2023-10-30"
tags = ["php", "experiment", "framework"]
image = "/images/post-headers/pixellated-code.png"
+++

A few months ago, when I was working on a Laravel project, I started thinking about the design patterns it's built on and how ubiquitous those patterns are in other frameworks. At its core is the MVC pattern, which has its roots in the 1970s. Similarly, the concept of middleware has been around for roughly as long, although in web frameworks it tends to specifically refer to the "glue" between various stages of the request/response lifecycle.

In Laravel and many other frameworks, there is some interplay between those two patterns: middleware comes before and after the controller. It wouldn't be inaccurate to call the combined pattern MVMC (Model-View-Middleware-Controller).

This idea got me thinking about the line drawn between the middleware and the controller. In a sense, they're both just pieces of logic chained together to respond to a request. They receive a request object and return a response, the only difference being that controllers don't have access to the next piece of middleware in the stack (if any). What if we were to merge them into a single concept?

I decided to explore that by writing an experimental framework that replaces the "C" in MVC with _phases_, which are designed the handle the whole flow from request to response instead of just the "before" and "after". It also supports _pipelines_, which are the phase equivalent to Laravel's middleware groups. The basic idea is that you define a **route** which points to one or more **phases** (either via a **pipeline** or as a simple array of phases passed directly into the route definition).

For example, a route with just one phase associated with it looks like this:

{{<highlight php>}}
$r->addRoute('GET', '/example/{param}', [DoSomethingWithParam::class]);
{{</highlight>}}

Much like Laravel does with middleware, a complete version of this framework would ship with phases for handling things like authentication and input validation. You'd compose your business logic from these phases and custom ones.

### Phase anatomy

The code below illustrates the anatomy of a phase, which can be broken down into roughly three parts:

* Input (the request object and route parameters)
* State (phases are stateful for the duration of the request)
* Output (either a response or the next phase if one is expected)

{{<highlight php "linenos=table">}}
<?php

namespace App\Phases;

use Adbar\Dot;
use Phase\Http\Phase\Phase;
use Phase\Http\Response\ViewResponse;
use Symfony\Component\HttpFoundation\Response;

class DoThing extends Phase
{
    public function handle(Dot $state): Response
    {
        // Here's where you do something with the request.
        // Phase instances have three read-only properties as follows:

        // 1. The closure for calling the next phase in the pipeline.
        // There's a method of the same name that calls it with
        // call_user_func.
        $this->next; // Closure
        $this->next($state); // Method

        // 2. The current Symfony request object.
        $this->request;

        // 3. An array of resolved parameters from the route (if any).
        $this->params;

        // This method also receives one parameter - Dot $state.
        // It's a collection of values you can pass between phases.
        // In the first phase of a route, it's empty and ready to be
        // written to.
        $state->add('some.value', 1);
        $someValue = $state->get('some.value'); // 1

        // Phases ultimately return responses.
        // If a phase is supposed to terminate, it can directly return
        // a response like this:
        return new ViewResponse('blade.view', ['someValue' => $someValue]);

        // Otherwise, it can proceed to the next phase for the route:
        return $this->next($state);
    }
}
{{</highlight>}}

An obvious improvement that I didn't get around to implementing would be dependency injection. Having to implement the same `handle` interface method for every phase is also not a great experience, but equally, that rigidity encourages writing phases that roughly follow the single-responsibility principle. They're not unlike single action controllers.

### Object-oriented state

For the state object that carries state between phases, I integrated [adbario/php-dot-notation](https://github.com/adbario/php-dot-notation). This was a quick and easy way to get the idea across, but it probably wouldn't hold up well in a real project where you could be juggling lots of data on the lead-up to generating a response.

One way to improve this would be to make it more object-oriented. If PHP had generics, the state object could act more like a container to typed instances of data, which could be read and written like so:

{{<highlight php "linenos=table">}}
// Write some data
$data = new SomeData;
$data->value = "abc";
$state->set<SomeData>($data);

// Read data
$data = $state->get<SomeData>();

// Modify and write it again
$data->value = "def";
$state->set<SomeData>($data);
{{</highlight>}}

Even without generics, this could be approximated by passing the class string as an argument instead, like `$state->set(SomeData::class, $data);`.

---

{{< og-summary "https://github.com/Riari/php-phase" "php-phase.png" >}}