c='/* module.js 2014-3-9 | https://github.com/jkalbhenn/module.js */'
echo "$c" > module.js
cat module.src.js |uglifyjs --no-copyright >> module.js
echo "$c" > module.compat.js
cat compat.js module.src.js |uglifyjs --no-copyright >> module.compat.js
