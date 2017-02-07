# Shoobx Hangman Exercise

Wasn’t sure how far to take this. The statement about scaling is not addressed
since it struck me as out of bounds for an interview exercise — I could set up
clustering, but this would imply usage of redis or something for managing
session state across application instances. Since this is just a demonstration
of a solution, instead the sessions are just held in memory (not something I
would normally do).

The expected runtime is node 7+. The client app is accessible at port 8888. I
didn’t do anything fancy with the UI; there’s no demonstration of Angular usage
here or anything, but if you want I can convert it to use that. It’s also using
contemporary JS and DOM APIs which I have not transpiled or provided polyfills
for since I figured I did not need to worry about IE support :)

Regarding architecture you’ll note that except for the entrypoint, all modules
are stateless. Although it’s not like I’m about to write unit tests for this,
that’s the reason I do that normally.
