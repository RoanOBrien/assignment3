(function () {
    var tl1 = new TimelineMax({
        repeat: -1
    });

    tl1.to('#warning', 0.5, {
        ease: Power0.easeNone,
        opacity: 1
    })
   .to('#warning', 0.5, {ease: Power0.easeNone, opacity: 0})
}());
