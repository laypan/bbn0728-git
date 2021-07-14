var gulp = require('gulp'),
    concat = require('gulp-concat') //引入Concat套件
    uglify = require('gulp-uglify') //引入uglify套件
    sass = require('gulp-sass')     //引入sass套件
    connect = require('gulp-connect') //引入connect套件
    watch = require('gulp-watch')     //引入watch套件
    imagemin = require('gulp-imagemin') // 圖片壓縮
    cssbeautify = require('gulp-cssbeautify')// SASS
    fileinclude= require('gulp-file-include')//模板
    pngquant = require('imagemin-pngquant')//png圖片壓縮
    rep = require('gulp-replace-image-src')//替換圖片路徑
    urlAdjuster = require('gulp-css-replace-url');//替換CSS圖片路徑

gulp.task('serverGO', function () {
    connect.server({
        root: 'build', //設定開啟位置
        livereload: true, //開啟livereload
        port: 8787 //設定預設port為8787
    });
});

//將src內的所有js打包成all.js並將all.js輸出至build/js的目錄下
gulp.task('scripts', function () {
    return watch('src/assets/js/*.js', function () {   //監看src目錄底下的所有js檔
        gulp.src('src/assets/js/*.js')                 //設定來源檔案為src目錄底下的所有js檔
            // .pipe(concat('all.js'))
            // .pipe(uglify())
            .pipe(gulp.dest('build/js/'))      //輸出至build目錄底下
            .pipe(gulp.dest('release/js/'))      //輸出至release目錄底下
            .pipe(connect.reload());            //利用connect套件刷新頁面
    });
});

// 任務提示
gulp.task('message',function(){
    return console.log('gulp is running!!!!!!GO~~~~~~~~~~~~~~~');
});

//將src內的所有scss輸出至build目錄下
gulp.task('sassGO', function () {
    return watch('src/assets/sass/*', function () {     //監看src目錄底下的所有scss檔
        gulp.src('src/assets/sass/*')                //設定來源檔案為src目錄底下的所有scss檔
            .pipe(sass(
            {
                sourceMap: 'sass',
                outputStyle: 'nested'
            }
                ).on('error', sass.logError))
            .pipe(gulp.dest('build/css/'))             //輸出至build目錄底下
            .pipe(connect.reload());                 //利用connect套件刷新頁面
    });
});

// release前把圖片路徑更新
gulp.task('replace', function() {
  gulp.src('build/*.html')
    .pipe(rep({
      prependSrc : 'https://s3-ap-northeast-1.amazonaws.com/ac.ezimport.co.jp/event/2020antivirus/',
      keepOrigin : true
    }))
    .pipe(gulp.dest('release/'));
  gulp.src('build/css/*.css')
    .pipe(urlAdjuster({
      replace:  ['../images/','https://s3-ap-northeast-1.amazonaws.com/ac.ezimport.co.jp/event/2020antivirus/images/'],
      append: '?version=1',
    }))
    .pipe(gulp.dest('release/css/'));
    
});


// 任务： 图片压缩
gulp.task('imagemin',function(){
    gulp.src('src/assets/images/**/*')
        .pipe(imagemin({ 
             progressive: true, 
             svgoPlugins: [{removeViewBox: false}], 
             use: [pngquant()] 
         })) 
        .pipe(gulp.dest('build/images/')) 
       
});

gulp.task('copyHtml',function(){
    gulp.src(['src/view/*.html'])
            .pipe(fileinclude({
                prefix: '@@',
                basepath: 'src/include/',
                indent:true
            }))
            .pipe(gulp.dest('build/'))
           
});


//監聽build/html
gulp.task('htmlGO', function () {
    return watch('build/**/*.html', function () {
        gulp.src('build/**/*.html') 
            .pipe(connect.reload());              
    });
});

gulp.task('watch',function(){
    gulp.watch('src/assets/js/*',['scripts']); //
//     gulpLivereload.listen();
    gulp.watch('src/assets/sass/*',['sassGO']);
    gulp.watch('src/**/*.html',['copyHtml']);
//     gulp.watch('src/assets/images/*',['imagemin']);

});


//內建的watch方式
// gulp.task('watch', function () {
//     gulp.watch('src/**/*.scss', ['sassGO']);
//     gulp.watch('src/**/*.js', ['scripts']);
//     gulp.watch('build/**/*.html', ['htmlGO']);
// });
gulp.task('default', ['message','copyHtml','scripts', 'sassGO', 'serverGO', 'htmlGO']);
// gulp.task('default', ['scripts', 'sassGO', 'serverGO', 'watch']);