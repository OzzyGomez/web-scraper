# web-scraper
Scrapes a list of urls, of similarly structured website, from a txt file and outputs them into a json file.
This can be modified for different pages.

## Requirements
- NodeJS

## To Run
#### Install Dependencies (Required before first run)
```shell
npm install
```

#### Edit urls.txt 
Edit urls.txt to match the sites you will be scraping.

#### Edit filters
Simply change the tag/class/id to match where the content is located on the page so that the scraper doesn't get unneeded information.
``` Shell
$('[TAG/CLASS/ID]').filter(function() { ... });
```

#### Add
If your webpages have more content to be organized add more.
In `scrapePage()`:
- Add to the `json` variable
- Add filter to get content. (Just copy and replace as needed) 

#### Run Script
```shell
node index.js
```

## Outputs
The output is written to output.json

## Source of articles
- urls.txt
- You can comment out lines with a #.