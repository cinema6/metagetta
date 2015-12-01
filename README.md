metagetta
=========

Metagetta is a library for fetching content metadata from around the web. Supported sources include:

* [YouTube](https://www.youtube.com/)
* [Vimeo](https://vimeo.com/)
* [Dailymotion](http://www.dailymotion.com/)
* [IAB VAST Tag](http://www.iab.net/guidelines/508676/digitalvideo/vsuite/vast/vast_copy)
* [Instagram Videos](https://www.instagram.com/)
* [Wistia Videos](http://wistia.com/hub)
* [JWPlayer Videos](http://www.jwplayer.com/)

API
---
### metagetta(*uri*, [*options*])
*uri* should be a valid URI from any of the supported sources. For example, a YouTube URI (https://www.youtube.com/watch?v=fPDYj3IMkRI), a Vimeo URI (https://vimeo.com/135288462), a Dailymotion URI (http://www.dailymotion.com/video/x30f1ti_the-iced-beverage-rap_fun), a VAST tag (http://ad3.liverail.com/?LR_PUBLISHER_ID=1331&LR_CAMPAIGN_ID=229&LR_SCHEMA=vast2.), an Instagram URI (https://instagram.com/p/6DD1crjvG7/), a Wistia URI (https://cinema6.wistia.com/medias/9iqvphjp4u), or a JWPlayer URI (https://content.jwplatform.com/previews/iGznZrKK-n5DiyUyn) *uri* can also be an ```Array``` of URIs (to batch calls.)

*options* (optional) should be an object containing configuration options.

A Promise is returned that will be fulfilled with the content's metadata.

### metagetta(*options*)
*options* should be an object containing configuration options. It can also be an ```Array``` of *options* (to batch calls.)

A Promise is returned that will be fulfilled with the content's metadata.

### metagetta.withConfig(*options*)
This method will return a **new** instance of ```metagetta()``` that is pre-configured with the specified *options*.

Options
-------
The following configuration options are valid:

* **uri**: A URI from any of the supported sources.
* **type**: The name of a source. Supported sources are ```youtube```, ```vimeo```, ```dailymotion```, ```vast```, ```instagram```, or ```wistia```.
* **id**: The ID of a piece of content. This does *not* apply to VAST videos.
* **fields**: An ```Array``` of the only response fields that should be included. This is useful as it can potentially reduce the amount of [YouTube quota units](https://developers.google.com/youtube/v3/getting-started#quota) metagetta consumes.
* **youtube.key**: A [YouTube API Key](https://developers.google.com/youtube/android/player/register#Create_API_Keys) (required to make calls against YouTube's Data API.)
* **instagram.key**: An [Instagram API Client Key](https://instagram.com/developer/) (required to make calls against Instagram's API)
* **wistia.key**: A [Wistia API Password](http://wistia.com/doc/data-api#making_requests) (required to make calls against Wistia's API)
* **jwplayer.key**: A [JWPlayer API Key](http://apidocs.jwplayer.com/authentication.html) (required to make calls against JWPlayer's API)
* **jwplayer.secret**: A [JWPlayer API Secret](http://apidocs.jwplayer.com/authentication.html) (also required to make calls against JWPlayer's API)

Response
--------
The following response object will be provided no matter the source of the content:

* **type**: The source of the content
* **id**: The unique ID of the content
* **uri**: The URI for the content
* **title**: The name of the content
* **description**: A description of the content
* **duration**: The duration (in seconds) of the content
* **hd**: A ```Boolean``` indicating if the content is HD or not; for VAST, the highest-quality media file will be used
* **tags**: An ```Array``` of video tags
* **publishedTime**: A ```Date``` representing when the content was published/created

Example
-------
```javascript
var metagetta = require('metagetta').withConfig({
  youtube: { key: 'f4938yrt83497ryf48975fh348957f4389' }
});

metagetta([
  'https://www.youtube.com/watch?v=fPDYj3IMkRI',
  'https://vimeo.com/135288462',
  'http://www.dailymotion.com/video/x30f1ti_the-iced-beverage-rap_fun',
  'http://ad3.liverail.com/?LR_PUBLISHER_ID=1331&LR_CAMPAIGN_ID=229&LR_SCHEMA=vast2',
  'https://instagram.com/p/6DD1crjvG7/'
]).then(function(videos) {
  videos.forEach(function(video) {
    console.log(video.title + ' is ' + video.duration + ' seconds!');
  });
}).catch(function(error) {
  console.error('There was a problem: ' + error);
});
```

Notes
-------
* As of now, JWPlayer metadata will not be retrievable in a browser environment
