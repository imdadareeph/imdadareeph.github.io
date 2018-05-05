Presented By -

```
(_)_ __   __   _| | __ _   _| | __ _ _ __   _ _	  _ _   _ __  | |_
| | '_ \ /_ |/ _  |/ _` |/ _  |/ _` | '__|/ / ,_)/ / ,_)| '_ \| |__ \
| | | | | | | (_| | (_| | (_| | (_| | |  | | `) | | `)  | |_) | |  | |
|_|_| |_| |_|\__,_|\__,_|\__,_|\__,_|_|   \_\,   \_\,	| ,_ /| |  | |  
                                                        |_|
```
<a href="http://www.imdadareeph.com/" title=""><img src="/images/version.svg?sanitize=true" alt="version"></a>
<p align="center">
       <img src="http://i66.tinypic.com/5ds7pu.jpg" alt="imdadareeph.com">
</p>

# How to use?

Simply build the image using `$docker build -t imdadareeph/rhel7nodejs9:v1.0.1 .`

and run it with all needed parameter:

```console
$ docker run -d -p 8888:8888 imdadareeph/rhel7nodejs9:v1.0.1
```

That's it.

## Templates and others

This image uses templates modified from free site.
Template is by Creative CV. All rights reserved. Design - [TemplateFlip](https://templateflip.com/)

## Environment variables

This image uses following commands for configuration.

|docker commands     |Default value        |Description                                         |
|------------------------|---------------------|----------------------------------------------------|
|`Docker build`    |no default           |$docker build -t imdadareeph/rhel7nodejs9:v1.0.1 .|
|`Docker run`    |no default           |docker run -d -p 8888:8888 imdadareeph/rhel7nodejs9:v1.0.1            |



# Updates and updating

To update your setup simply pull the newest image version from docker hub and run it.


## Deprecated features

Instead of using imdadareeph/rhel7nodejs9 image, any light nodejs image can be used (e.g. node:alpine)

# License

Everything in [this repository](https://github.com/imdadareeph/imdadareeph.github.io) is published under [GPL-3](https://spdx.org/licenses/GPL-3.0).
