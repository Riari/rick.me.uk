+++
categories = ["Development", "VIM"]
date = "2021-02-24"
summary = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
tags = [".vimrc", "plugins", "spf13-vim", "vim"]
title = "A Test Post"
slug = "a-test-post"
+++

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eleifend velit et mi ultrices condimentum. Proin finibus felis id nisi porttitor, ac mattis nisi finibus. Pellentesque ornare lorem ac mi aliquam molestie. Mauris nec nisl sed quam mollis pulvinar. Morbi eget ipsum sit amet urna convallis gravida ac vitae nisi. In lectus sapien, egestas hendrerit lobortis sed, malesuada pretium libero. Donec a venenatis justo, in gravida lacus. Nam at ligula eget turpis blandit convallis vitae vel est. Morbi fringilla leo sapien, sed semper elit pulvinar eget. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque libero ligula, viverra vel felis nec, egestas vehicula nulla. Aenean suscipit ligula urna, a congue lacus finibus ut. Aliquam iaculis erat convallis dapibus dictum. Donec bibendum erat mi, quis malesuada urna mattis consectetur. Aenean felis enim, ultricies sed tincidunt vel, auctor et ex. Praesent finibus tempor laoreet.

{{< highlight cpp "linenos=table,hl_lines=12-14" >}}
#pragma once

#include <glm/ext.hpp>
#include <glm/glm.hpp>

namespace Iris
{
    const glm::mat4 IDENTITY = glm::mat4(1.0f);

    struct Transform
    {
        glm::vec3 position;
        float rotation;
        glm::vec3 scale;

        glm::mat4 GetModel()
        {
            auto model = IDENTITY;
            model = glm::translate(model, position);
            model = glm::rotate(model, rotation, glm::vec3(1.0f));
            model = glm::scale(model, scale);
            return model;
        }
    };
}
{{< / highlight >}}

Vestibulum lobortis egestas velit. Sed at scelerisque nisi. Curabitur viverra non sem quis volutpat. Integer mi justo, rutrum sed elit nec, lacinia pulvinar mi. Nam viverra sodales nisl, non finibus ligula semper vel. Proin faucibus pretium auctor. Sed nec erat mattis dui pharetra dapibus ac et dolor. Praesent nec justo eu ligula fringilla consequat et quis mauris. Donec accumsan dui at tincidunt euismod. Aliquam quis dolor non diam lacinia faucibus. Praesent et est posuere, laoreet erat fermentum, vehicula arcu. Etiam porttitor tincidunt nunc nec finibus. Nam at blandit lorem, eget rhoncus ligula. Fusce luctus cursus metus non eleifend.

Nulla mattis leo non velit dictum, eget semper eros lobortis. Vestibulum ut diam nec odio laoreet tempor nec eu tellus. Morbi sagittis iaculis eros quis tempus. Proin eleifend velit nisl, vel mattis turpis dignissim sed. Praesent et feugiat tellus. Donec orci leo, euismod eget interdum ac, semper in sapien. Etiam aliquet metus eu leo posuere lacinia. Etiam sit amet accumsan dolor. Donec venenatis magna sit amet urna hendrerit vestibulum. Etiam luctus consequat turpis, sed placerat dolor vestibulum eget.

Praesent metus dui, tristique et imperdiet ac, luctus ac est. Morbi dolor quam, sollicitudin eget elementum sed, malesuada vitae augue. Ut et eleifend sapien, viverra eleifend lorem. Fusce pulvinar molestie justo nec vulputate. Donec sit amet sapien non turpis aliquam aliquam. Pellentesque nulla justo, porta ut pellentesque ac, lacinia a magna. Donec sodales ac ex ac luctus. Ut quis nibh augue. Maecenas at est eget orci interdum rutrum. Pellentesque nec mi porta, suscipit eros nec, malesuada sapien. Vivamus nec consectetur mi. Morbi vestibulum volutpat luctus. Integer in lorem a orci consequat eleifend sit amet non magna. Fusce bibendum purus ut arcu rutrum ultrices. Suspendisse ornare massa quis nulla dictum, ac convallis nisi placerat. Integer laoreet ultricies turpis, volutpat lobortis massa lobortis sit amet.

In nec ligula cursus, dignissim ligula at, porta odio. Phasellus sit amet justo mauris. Morbi auctor nunc nec eros ullamcorper, nec dictum lacus elementum. Donec quis sem erat. Donec congue id lectus nec varius. Mauris a orci ligula. Etiam augue enim, congue at consectetur at, rhoncus et enim. Vivamus eu justo sed est rutrum feugiat. Nunc non elit ac massa aliquet consectetur id vitae sapien. Vestibulum varius arcu in volutpat dictum. Sed vel risus enim. Curabitur eu leo in massa faucibus imperdiet. Morbi et dapibus velit. Nam at nibh ornare, fringilla felis in, tempor magna. Suspendisse fermentum massa ipsum, ut condimentum augue vestibulum eget. 