npm run bundle
npm run minify

$resultFilePath = $args[0]
Copy-Item -Path dist/bundle.min.js -Destination $resultFilePath