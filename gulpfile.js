const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");

gulp.task("server", ["browserSync", "watch"]);

gulp.task("browserSync", function() {
    browserSync.init({
       server: {
           baseDir: "app"
       }
    });
});

gulp.task("watch", function() {
    gulp.watch("app/*.html").on("change", browserSync.reload);
    gulp.watch("app/resources/js/*.js").on("change", browserSync.reload);
    gulp.watch("app/resources/sass/**/*.scss", ["sass-compile"]).on("change", browserSync.reload);
});

gulp.task("sass-compile", function() {
    gulp.src("app/resources/sass/main.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("app/resources/css/"));
});
