(function($){
	$.extend({
		simpleProgress:function(config){
            function Progress(){
                this.id      = config.id;
                this.text    = config.text;
                if(!config.id || config.id.length == 0){
                    throw "id can not be null";
                }else{
                    this.id = config.id;
                }
                if(isNaN(config.step)){
                    throw "step must be a integer";
                }else{
                    this.step = parseInt(config.step);
                }
                if(config.text){
                    if(config.text.length != this.step){
                        throw "Array text length must equals step";
                    }
                    this.text = config.text;
                }
                var obj = build(this.id,this.step,this.text);
                this.points = obj.points;
                this.cursors = obj.cursors;
                this.activeIndex = 0;
            }

            function buildBar(wrap,step,text){
                var cursors = [];
                for(var i = 0;i<step;i++){
                    var bar = $("<div>").addClass("bar");
                    var cursor = $("<div>").addClass("cursor");
                    if(text){
                        cursor.html(text[i]);
                    }
                    var widthPct = (1/step*100)+"%";
                    bar.append(cursor).appendTo(wrap).width(widthPct);
                    cursors.push(cursor);
                }
                return cursors;
            }

            function buildPoint(cursors,step){
                var points = [];
                for(var i = 0;i<step;i++){
                    var point = $("<div>").addClass("point").html(i+1);
                    points.push(
                        point.appendTo(cursors[i])
                    );
                }
                return points;
            }

            function build(id,step,text){
                var wrap = $("#"+id);
                var progress = $("<div>").addClass("z-progress").appendTo(wrap);
                var cursors = buildBar(progress,step,text);
                var points  = buildPoint(cursors,step);
                return {
                    "cursors":cursors,
                    "points":points
                };
            };

            Progress.prototype.jump = function(toIndex){
                if(toIndex > this.step){
                    throw "toIndex must less than step";
                }
                if(toIndex > this.activeIndex){
                    var othis = this;
                    function iter(){
                        if(othis.activeIndex <= toIndex-1){
                            $(othis.cursors[othis.activeIndex]).animate({
                                width:"100%"
                            },function(){
                                othis.activeIndex += 1;
                                othis.points[othis.activeIndex-1].addClass("active");
                                iter();
                            });
                        }
                    }
                    iter();
                }
            };

            Progress.prototype.next = function(){
                this.jump(this.activeIndex+1);
            };

            Progress.prototype.getCurrent = function(){
                return this.activeIndex+1;
            };

            Progress.prototype.getStep = function(){
                return this.step;
            };

            return new Progress(config);
        },
	});
})(jQuery);