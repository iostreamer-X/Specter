# Specter

Not just a collection of generative art pieces, but also a Processing toolbelt, built atop opinionated abstractions.

## Order and Chaos

One can always find a shimmer of order in chaos. And order without chaos is a fallacy.

### Workings

The base of this algorithm is, to create lines with jitter effect. For that, I randomly choose a point on the line,
find the line perpendicular to the given line, choose a random point based on given maximum height on this perpendicular line, and the point I chose on my original line gets shifted to this new point.

Now that we are done with lines, let's focus on circles. To create a circle with jitter effect, I forwent the standard ellipse function. Rather I create my own version of circle function. Where a circle is built by tiny lines, and all these tiny lines have jitter effect.

And the whole thing is brought together by these 2 simple lines of code:

```python
for iteration in range(1, 160):
    strokeWeight(map(noise(iteration), 0, 1, 1, 1.2))
    jitteryCircle(width/2, height/2, radius + map(noise(iteration), 0, 1, radius*iteration*0.7, radius*iteration), 15, iteration=iteration*0.4)
```

This loop is used to simply magnify the circle and other effects, more the iterations, larger the size, larger the effects. This is guaranteed by passing the `iteration` variable to `jitteryCircle`, which in turn is passed to `jitteryLine`. In this way, each function is aware of current iteration, and can use it to change its state. For example, `jitterLine` could change its jitter height based on `iteration`.

`jitteryCircle` also take `turns` as an argument, as in how many times should it draw the circle. Now one would think why would this matter, it will only be overwriting the same circle. Well, yes, unless, with each plotting of line, the radius is also changing. Then, higher the `turns`, more spread out the circle will be. And as one can witness in the images, the spread is a direct consequence of `turns` being `15`.

For **Order**, I did all the things explained above, but also played with `stroke`, in order to bring out a nice red, blue gradient.
And for **Chaos**, I varied the grayness but also turned up the jitter effect.

![Order](/artwork/order_and_chaos/order.png)

![Chaos](/artwork/order_and_chaos/chaos.png)