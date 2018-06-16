/// <binding BeforeBuild='build:all' />
/*
This file is the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. https://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    sourcemaps = require("gulp-sourcemaps"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    ts = require("gulp-typescript");

var paths = {
    root: ""
};

paths.jsDest = paths.root + "./content";
paths.concatJsDest = paths.jsDest + "/jlattimer.d365appinsights.js";
paths.concatJsMinDest = paths.jsDest + "/jlattimer.d365appinsights.min.js";
paths.dTsDest = paths.jsDest + "/Scripts/typings/jlattimer.d365appinsights";

gulp.task("build:ts", function () {
    var tsProject = ts.createProject("../D365AppInsights.Js/tsconfig.json");

    return tsProject.src().pipe(tsProject()).pipe(gulp.dest("../D365AppInsights.Js/js"));
});

gulp.task("move:ts", ["build:ts"], function (callback) {
    gulp.src("../D365AppInsights.Js/ts/jlattimer.d365appinsights.ts").pipe(gulp.dest(paths.jsDest + "/ts")).on("end", callback);
});

gulp.task("move:dts", ["move:ts"], function (callback) {
    gulp.src("../D365AppInsights.Js/js/jlattimer.d365appinsights.d.ts").pipe(gulp.dest(paths.dTsDest)).on("end", callback);
});

gulp.task("move:js", ["move:dts"], function (callback) {
    gulp.src([paths.root + "../D365AppInsights.Js/scripts/AiLogger.js", paths.root + "../D365AppInsights.Js/js/jlattimer.d365appinsights.js"])
        .pipe(concat(paths.concatJsDest))
        .pipe(gulp.dest("")).on("end", callback);
});

gulp.task("min:js", ["move:js"], function (callback) {
    gulp.src([paths.root + "../D365AppInsights.Js/scripts/AiLogger.js", paths.root + "../D365AppInsights.Js/js/jlattimer.d365appinsights.js"])
        .pipe(sourcemaps.init())
        .pipe(concat(paths.concatJsMinDest))
        .pipe(gulp.dest(""))
        .pipe(uglify())
        .pipe(sourcemaps.write(""))
        .pipe(gulp.dest("")).on("end", callback);
});

gulp.task("build:all", ["build:ts", "move:ts", "move:dts", "move:js", "min:js"]);