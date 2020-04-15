FROM nginx:alpine

# copy the build folder from react to the root of nginx (www)
COPY  build /usr/share/nginx/html
# --------- only for those using react router ----------
# if you are using react router 
# you need to overwrite the default nginx configurations
# remove default nginx configuration file
# RUN rm /etc/nginx/conf.d/default.conf
# replace with custom one
COPY app/.nginx.conf /etc/nginx/conf.d/default.conf
# --------- /only for those using react router ----------
# expose port 80 to the outer world
EXPOSE 80
# start nginx 
CMD ["nginx", "-g", "daemon off;"]