# ZOOM.JS


A pure JavaScript image zooming plugin; as seen on
[Medium.com](https://medium.com/designing-medium/image-zoom-on-medium-24d146fc0c20). 

Has no jQuery or Bootstrap dependencies.

This is a port of the original version by @nishanth: <https://github.com/nishanths/zoom.js>.

### Direct

1. Link the zoom.js and zoom.css files to your site or application.

  ```html
  <link href="css/zoom.css" rel="stylesheet">
  <script src="dist/zoom.js"></script>
  ```

2. Add a `data-action="zoom"` attribute to the images you want to make
   zoomable. For example:

  ```html
  <img src="img/blog_post_featured.png" data-action="zoom">
  ```

### Via npm

1. Install the package: `npm i @youngluo/zoom.js`
1. Link the zoom.css file to your application.

  ```html
   <link href="css/zoom.css" rel="stylesheet">
   ```

1. Import the package and call `zoom.setup(elem)` for each image you want to
   make zoomable. 

  ```js
  import zoom from "@youngluo/zoom.js";

  var imgElem = new Image();
  imgElem.src = "tree.png";
  document.body.appendChild(imgElem);

  zoom.setup(imgElem);
  ```

## Demo

<https://nishanths.github.io/zoom.js>

![gif](https://i.imgur.com/gj3foRU.gif)


## Notes

It has the same behavior and all the features from the original implementation. But:

```
* In addition to the dist/ scripts, it's available as an npm module.
* Browser compatibility may be lower. Uses the transitionend event without
  vendor prefixes, so IE 10 or higher.
```
