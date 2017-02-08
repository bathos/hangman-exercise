# Shoobx Hangman Exercise

## To Run

The expected runtime is node 7+. The client app will be accessible at port 8888.

## Implementation

A node application with a (very simple) REST interface for a single resource,
"game".

Except for the entrypoint, all modules are stateless, usually exporting a single
function/constructor. While not necessary here, I usually abide by some form of
this pattern to ensure things remain unit testable.

The client application is an SPA technically, leveraging the endpoints mentioned
above, but it’s trivial enough that this description might be misleading.

## Notes & Caveats

I didn’t do anything fancy with the UI; there’s no demonstration of Angular
usage here or anything, but if you want I can convert it to use that. It’s also
using contemporary JS and DOM APIs which I have not transpiled or provided
polyfills for since I figured I did not need to worry about IE support :)

I wasn’t sure how far I’m meant to take this. Some parts of the spec could be
read to imply real data persistence or even tracking users instead of sessions,
but this, and "must scale to millions of users" seemed out of bounds for an
interview exercise, so instead I’ll just try to describe how I might have
approach these things with more time and resources:

- as it is, the app could handle a few thousands concurrent users
- to scale beyond that, initially I would use the native `cluster` module and
  introduce a shared data store like redis
- if we needed to go still further, I’d consider using aws for load balancing
  ec2 instances
- in general, I would be careful not to introduce any statefulness which is not
  modeled as part of a shared data store or db

In contrast, here there is no persistence, only in-memory sessions. I would not
do this normally of course.
