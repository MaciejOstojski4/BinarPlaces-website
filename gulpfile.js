let gulp = require("gulp");
let browserSync = require("browser-sync").create();

gulp.task("server", ["browserSync"]);

gulp.task("browserSync", function() {
    browserSync.init({
       server: {
           baseDir: "app"
       }
    });

    gulp.watch("app/*.html").on("change", browserSync.reload);
    gulp.watch("app/resources/js/*.js").on("change", browserSync.reload);
    gulp.watch("app/resources/css/*.css").on("change", browserSync.reload);
});