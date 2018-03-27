FROM imdadareeph/rhel7nodejs9
MAINTAINER Imdad Areeph <imdadareeph@gmail.com>
RUN mkdir -p /srv/imdadareeph
EXPOSE 8888
ENV PORT 8888
ADD . /srv/imdadareeph
ADD index.js /srv/imdadareeph
ADD package.json /srv/imdadareeph
WORKDIR /srv/imdadareeph
RUN npm install
CMD ["npm", "start"]
