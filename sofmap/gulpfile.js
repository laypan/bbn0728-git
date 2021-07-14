var gulp = require('gulp'),
    concat = require('gulp-concat') //����Concat�׼�
    uglify = require('gulp-uglify') //����uglify�׼�
    sass = require('gulp-sass')     //����sass�׼�
    connect = require('gulp-connect') //����connect�׼�
    watch = require('gulp-watch')     //����watch�׼�
    imagemin = require('gulp-imagemin') // �DƬ���s
    cssbeautify = require('gulp-cssbeautify')// SASS
    fileinclude= require('gulp-file-include')//ģ��
    pngquant = require('imagemin-pngquant')//png�DƬ���s
    rep = require('gulp-replace-image-src')//��Q�DƬ·��
    urlAdjuster = require('gulp-css-replace-url');//��QCSS�DƬ·��

gulp.task('serverGO', function () {
    connect.server({
        root: 'build', //�O���_��λ��
        livereload: true, //�_��livereload
        port: 8787 //�O���A�Oport��8787
    });
});

//��src�ȵ�����js�����all.js�K��all.jsݔ����build/js��Ŀ���
gulp.task('scripts', function () {
    return watch('src/assets/js/*.js', function () {   //�O��srcĿ䛵��µ�����js�n
        gulp.src('src/assets/js/*.js')                 //�O����Դ�n����srcĿ䛵��µ�����js�n
            // .pipe(concat('all.js'))
            // .pipe(uglify())
            .pipe(gulp.dest('build/js/'))      //ݔ����buildĿ䛵���
            .pipe(gulp.dest('release/js/'))      //ݔ����releaseĿ䛵���
            .pipe(connect.reload());            //����connect�׼�ˢ�����
    });
});

// �΄���ʾ
gulp.task('message',function(){
    return console.log('gulp is running!!!!!!GO~~~~~~~~~~~~~~~');
});

//��src�ȵ�����scssݔ����buildĿ���
gulp.task('sassGO', function () {
    return watch('src/assets/sass/*', function () {     //�O��srcĿ䛵��µ�����scss�n
        gulp.src('src/assets/sass/*')                //�O����Դ�n����srcĿ䛵��µ�����scss�n
            .pipe(sass(
            {
                sourceMap: 'sass',
                outputStyle: 'nested'
            }
                ).on('error', sass.logError))
            .pipe(gulp.dest('build/css/'))             //ݔ����buildĿ䛵���
            .pipe(connect.reload());                 //����connect�׼�ˢ�����
    });
});

// releaseǰ�шDƬ·������
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


// ���� ͼƬѹ��
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


//�O build/html
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


//�Ƚ���watch��ʽ
// gulp.task('watch', function () {
//     gulp.watch('src/**/*.scss', ['sassGO']);
//     gulp.watch('src/**/*.js', ['scripts']);
//     gulp.watch('build/**/*.html', ['htmlGO']);
// });
gulp.task('default', ['message','copyHtml','scripts', 'sassGO', 'serverGO', 'htmlGO']);
// gulp.task('default', ['scripts', 'sassGO', 'serverGO', 'watch']);