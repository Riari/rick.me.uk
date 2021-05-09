+++
title = "Building a 3D Game Engine in C++: A Devlog (Preface)"
slug = "building-a-game-engine-devlog-preface"
summary = "Chronicling my first attempt at building a 3D game engine on modern paradigms."
date = "2021-02-25"
tags = ["devlog", "cpp", "game-engine"]
image = "/images/post-headers/building-game-engine-generic.png"
+++

This is the first post of what will hopefully become a comprehensive devlog detailing my work as I take a shot at creating my first "proper" 3D game engine. Needless to say I'm far, _far_ from the first to do something like this—especially in C++—but if I can share a few of my own ideas and learn a lot along the way, it'll be worthwhile!

I've already done a lot of the groundwork for this project. It started out as an effort to follow [LearnOpenGL](https://learnopengl.com/), but I found myself wanting to refactor the code and build more than just a renderer, so it inevitably evolved into the rough beginnings of an engine (at which point I renamed the project to "Iris", after [a cat](./iris.jpg) I helped my parents adopt!). Through that process, I've decided on a rough set of goals to start with:

* OpenGL first, DirectX and/or Vulkan later (much, much later!)
* Desktop only (but with potential consideration towards controller support)
* ECS-based with scene graphs
* C++17-based
* Performance as a priority, but not #1 (I'll worry more about this in future engine projects; it's a huge area to cover)

I'll expand on these as I go. For example, I'd like to build an editor when there's enough of an engine to warrant having that. I also need to think about audio, but I want to focus on the graphics and input systems first.

To help keep myself on track and not produce an incorrigible mess, I'm using lots of resources and reference material, some of which are:

* Mastering C++ Game Development (2018)
* Game Engine Architecture (2015)
* Game Coding Complete, Fourth Edition (2013)
* [The Cherno's Game Engine series](https://www.youtube.com/watch?v=JxIZbV_XjAs&list=PLlrATfBNZ98dC-V-N3m0Go4deliWHPFwT)
* Modern open source C++ game engines ([there](https://github.com/TheCherno/Hazel) [are](https://github.com/godlikepanos/anki-3d-engine) [lots](https://github.com/amzeratul/halley) [of](https://github.com/nem0/LumixEngine) [examples](https://github.com/urho3d/Urho3D)!)

Lastly, the repo for this project is available at [https://github.com/Riari/iris-engine](https://github.com/Riari/iris-engine) and at the time of writing, my focus is on integrating an initial version of an [entity component system](https://en.wikipedia.org/wiki/Entity_component_system), the work-in-progress of which is in the `ecs` branch (so I can easily refer to the original, non-componentised code). In the next post, I'll cover some of the work I'm doing on that.