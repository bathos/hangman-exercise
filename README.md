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

The client JS is in a single file since I didn’t want to get into build scripts
or anything. Normally I would use a bundler, e.g. rollup, browserify or webpack
(well, personally I’d just always choose rollup, unless I had to use one of the
others for some reason).

There’s no DOM framework in play (if you want an Angularized version, let me
know). That means the rendering logic is rather verbose — though it’s sometimes
refreshing to write this way, and I think it’s good to be able to know how to
do it since no DOM framework can approach its performance characteristics.

Endpoints are:

- `POST /games`: create a new game, which becomes one’s active game
- `GET /games/:id`: retrieves game
- `PATCH /games/:id` updates game
- `GET /status`: returns play stats and active game ID if applicable

## Notes & Caveats

Both the backend and client code is using contemporary JS and DOM APIs which I
have not transpiled or provided polyfills for.

I wasn’t sure how far I’m meant to take this. Some parts of the spec could be
read to imply real data persistence or even tracking users instead of sessions,
but this, and "must scale to millions of users" seemed kind of extreme for an
interview exercise. Instead I’ll try to describe how I might have approach these
things given more time and resources:

- as it is, the app could handle a few thousands concurrent users
- to scale beyond that, initially I might use the native `cluster` module and
  introduce a shared data store like redis
- if we needed to go still further, I’d consider using aws for load balancing
  ec2 instances
- in general, I would be careful not to introduce any statefulness which is not
  modeled as part of some form of shared data store

In contrast, here there is no persistence, only in-memory sessions. I would not
do this normally of course.
