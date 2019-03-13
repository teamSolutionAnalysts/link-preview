## Installation
you install it with npm : 
```
   npm i @sa/link-preview
```
## Usage
You can include it easly :
### ES6
```javascript
	import linPreview from "@sa/link-preview";
```
### ES5
```javascript
	var linkPreview = require("@sa/link-preview");
```
### Parameters
#### url
Type: `String`
#### timeout
Type: `Number`
### Value Returned
Type: `Promise`

Resolved value:
```javascript
    {
        description:"GitHub is where people build software. More than 24 million people use GitHub to discover, fork, and contribute to over 67 million projects.",
        image:"https://assets-cdn.github.com/images/modules/open_graph/github-logo.png",
        imageHeight:"1200",
        imageType:"image/png",
        imageWidth:"1200",
        siteName:"GitHub",
        title:"Build software better, together",
        url:"http://github.com"
    }
```
Reject if url is `undefined`

Rejected value:
```javascript
    { message: "You must add a valid url" }
```

### Syntaxe

```javascript
    linkPreview("https://github.com").then(response => {
            /*  response = {
                    description:"GitHub is where people build software. More than 24 million people use GitHub to discover, fork, and contribute to over 67 million projects.",
                    image:"https://assets-cdn.github.com/images/modules/open_graph/github-logo.png",
                    imageHeight:"1200",
                    imageType:"image/png",
                    imageWidth:"1200",
                    siteName:"GitHub",
                    title:"Build software better, together",
                    url:"http://github.com"
                }
            */
    });
    linkPreview("https://github.com",1000).then(response => {
            /*  if https://github.com answer before 1000ms 
                    response = {
                        description:"GitHub is where people build software. More than 24 million people use GitHub to discover, fork, and contribute to over 67 million projects.",
                        image:"https://assets-cdn.github.com/images/modules/open_graph/github-logo.png",
                        imageHeight:"1200",
                        imageType:"image/png",
                        imageWidth:"1200",
                        siteName:"GitHub",
                        title:"Build software better, together",
                        url:"http://github.com"
                    }
                else
                    response = {
                        description: null,
                        image:null,
                        imageHeight:null,
                        imageType:null,
                        imageWidth:null,
                        siteName:null,
                        title:null,
                        url:"https://ozbezpicybeu.com"
                    }
            */
    });
    linkPreview("https://ozbezpicybeu.com")then(response => {
            /*  response = {
                    description: null,
                    image:null,
                    imageHeight:null,
                    imageType:null,
                    imageWidth:null,
                    siteName:null,
                    title:null,
                    url:"https://ozbezpicybeu.com"
                }
            */
    });
    linkPreview("test")then(response => {
            /*  response = {
                    description: null,
                    image:null,
                    imageHeight:null,
                    imageType:null,
                    imageWidth:null,
                    siteName:null,
                    title:null,
                    url:"test"
                }
            */
    });
    linkPreview()then(() => {}).catch(err => {
        /*
            err = { message: "You must add a valid url" }
        */
    });
```