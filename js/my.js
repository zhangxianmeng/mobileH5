/**
 * Created by xianmeng.zhang on 2016/1/27.
 */
  	function showPage(){
	  document.querySelector('#divPageLoading').style.display = 'none';	
	  document.querySelector('#wrap').style.display = 'block';	
	}
  /*****************************��ܷ�װ****************************************/
// PageSlide������������:ҳ��Ԫ��,Ҫ�趨�Ļ�������,��ѡ����չ����
var PageSlide = function(el, swipe, options) {
  this.options = options || {}  //��ѡ����
  this.current = 0  //��ǰҳ������
  this.pageX  //�������ָ���
  this.pageY   //�������ָ���
  this.height //�豸�߶�
  this.width   //�豸���
  this.flag  //�жϻ�������ı���
  this.move  //�����ľ���
  this.$el = el //��ǰҳ��Ķ���
  this.swipe = swipe || 'X' //�����������
  this.resize().init().bindEvents() //��ʼ��
}
PageSlide.prototype.init = function(i) {
  var current = i ? this.$el.children[i] : this.$el.firstElementChild
  if (!current) throw 'ERROR';
//moving������Ϊ��ǰ����ҳ��ı��,Ҳ����ʽ������������չЧ��
  current.classList.add('moving')
  current.style.webkitTransform = 'translate3d(0,0,0)'
//��swipe��ֵԤ��������ҳ��Ŀ�ߣ���������Ľ���Ч��
  for(var i = 1; i <this.$el.children.length ; i++){
    this['set' + this.swipe](this.$el.children[i],  (this.swipe === 'X' ? this.width : this.height))
  }
  setTimeout(function() {
    current.classList.remove('moving')
    current.classList.add('play')
  }, 3e2)
  return this
}
//Ϊҳ��󶨸����¼��İ󶨺���
PageSlide.prototype.bindEvents = function() {
  var self = this
  window.addEventListener('resize orientationchange', this.resize.bind(this), false)
  'touchstart touchmove touchend touchcancel'.split(' ').forEach(function(evn) {
    //���ĸ����غ����������ں��棩�󶨵�ÿ��ҳ��
    self.$el.addEventListener(evn, self[evn].bind(self), false)
  })
}
//��õ�ǰ���ص�ҳ�����
PageSlide.prototype.getCurrent = function() {
  return this.$el.children[this.current]
}
//��ʼ��ʱ����豸�Ŀ��
PageSlide.prototype.resize = function() {
  this.width = this.$el.parentNode.clientWidth
  this.height = this.$el.parentNode.clientHeight
  return this
}
//��������ҳ���random()����
PageSlide.prototype.random = function() {
  var count = this.$el.children.length
  var current = this.current
  var arr = []
  var num
  for (var i = 0; i < count; i++) {
    if (i !== current) arr.push(i.toString())
  }
  num = Math.floor(Math.random() * arr.length)
  this.direct(+arr[num])
}
// �ĸ��ڽ��Ļ����¼�����,��ǰ��󶨺������Ӧ
PageSlide.prototype.touchstart = function(e) {
  var touches = e.touches[0]
  //���ؿ�ʼ
  this.flag = null
  this.move = 0
  //��¼���
  this.pageX = touches.pageX
  this.pageY = touches.pageY
}
PageSlide.prototype.touchmove = function(e) {
  var touches = e.touches[0]
  var X = touches.pageX - this.pageX
  var Y = touches.pageY - this.pageY
  var current = this.getCurrent()
  var next = current.nextElementSibling
  var prev = current.previousElementSibling
  //����ƶ���ʽ
  if (!this.flag) {
    this.flag = Math.abs(X) > Math.abs(Y) ? 'X' : 'Y'
    if (this.flag === this.swipe) {
      current.classList.add('moving')
      next && next.classList.add('moving')
      prev && prev.classList.add('moving')
    }
  }
  if (this.flag === this.swipe) {
    e.preventDefault()
    e.stopPropagation()
    switch (this.swipe) {
      case 'X':
        //swipe horizontal
        this.move = X
        this.setX(current, X)
        next && (this.setX(next, X + this.width))
        prev && (this.setX(prev, X - this.width))
        break;
      case 'Y':
        //swipe vertical
        this.move = Y
        this.setY(current, Y)
        next && (this.setY(next, Y + this.height))
        prev && (this.setY(prev, Y - this.height))
        break;
    }
  }
}
PageSlide.prototype.touchend = function(e) {
  var minRange = 50
  var move = this.move
  var current = this.getCurrent()
  var next = current.nextElementSibling
  var prev = current.previousElementSibling
  current.classList.remove('moving')
  next && next.classList.remove('moving')
  prev && prev.classList.remove('moving')
  if (!this.flag) return
  e.preventDefault()
  //��������ǰ����һҳ��,next()����������go()����
  if (move < -minRange && next ) return this.next()
  if (move > minRange && prev) return this.prev()
  this.reset()
}
PageSlide.prototype.touchcancel = function(e) {
  var current = this.getCurrent()
  var next = current.nextElementSibling
  var prev = current.previousElementSibling
  current.classList.remove('moving')
  next && next.classList.remove('moving')
  prev && prev.classList.remove('moving')
  this.reset()
}
//��̬�趨translate3d��������
PageSlide.prototype.setX = function(el, x, unit) {
  el && (el.style.webkitTransform = 'translate3d(' + x + (unit || 'px') + ',0,0)')
}
PageSlide.prototype.setY = function(el, y, unit) {
  el && (el.style.webkitTransform = 'translate3d(0,' + y + (unit || 'px') + ',0)')
}
//���õ�ǰ����ҳ��translate3d����Ϊ0�ķ���
PageSlide.prototype.setCurrent = function(el, i) {
  el && (el.style.webkitTransform = 'translate3d(0,0,0)')
  if (i) {
    this.current = i
    this.$current = this.$el.children[i]
  }
}
//����go()����ǰ����һ����һҳ��
PageSlide.prototype.next = function() {
  this.go(this.current + 1)
}
PageSlide.prototype.prev = function() {
  this.go(this.current - 1)
}
//���÷���,���ڳ�ʼ���Լ���ǰҳ�������
PageSlide.prototype.reset = function() {
  var width = this.width
  var height = this.height
  var swipe = this.swipe
  var current = this.getCurrent()
  var prev = current.previousElementSibling
  var next = current.nextElementSibling
  this.setCurrent(current)
  prev && (this['set' + swipe](prev, -(swipe === 'X' ? width : height)))
  next && (this['set' + swipe](next, swipe === 'X' ? width : height))
}
//ȥ����һ����һҳ���go����
PageSlide.prototype.go = function(i) {
  var onFinish = this.options.onFinish
  var current = this.getCurrent()
  var total = this.$el.childElementCount
  var target = this.$el.children[i]
  var d = i < this.current ? -1 : 1
  if (i === this.current || i < 0 || i >= total) return
  if (onFinish && (typeof onFinish === 'function')) onFinish.call(this, i)
  // ������ɵ��÷���
  typeof this.options.tranSetionEnd ==='function' && this.options.tranSetionEnd.call(this)
  this.current = i
  this['set' + this.swipe](current, -d * (this.swipe === 'X' ? this.width : this.height))
  this.setCurrent(target, i)
  this.finish(current, target)
}
//������ɺ�ɾ����ǰҳ��.play����Լ�Ϊ��һҳ�����.play���
PageSlide.prototype.finish = function(curr, target) {
  this.flag = null
  setTimeout(function() {
    curr && curr.classList.remove('play')
    target && target.classList.add('play')
  }, 3e2)
}
//ֱ������ҳ��ķ���
//ֱ��ĳһҳ��ķ���, ��Ϊ�и���Ŀ����Ҫ
//д���������,Ҫ������ҳ�濪ʼ������Ȼ�ܱ��������Ļ�������
//����Ҫ��ֱ��ҳ���ǰ������ҳ���translate3d����������Ϊ(0,-height,0)
PageSlide.prototype.direct = function(i){
  if(i&&typeof(i)==='number')
  {
    this.go(i)
    for(var j = 0; j< i ;j++) {
      this['set' + this.swipe](this.$el.children[j], -1 * (this.swipe === 'X' ? this.width : this.height))
    }
  }
  else  return


}
// ����
document.addEventListener('touchmove', function(e) {
  e.preventDefault()
})
var pages = new PageSlide(document.querySelector('.pages'), 'Y', {
  tranSetionEnd: function() {
    console.log(this.current);
  }
});

/*****************************rem��Ե�λ****************************************/
(function(win){
  var pageWidth = 6.4; /////设计图宽度640/100
  var docEl = document.documentElement;
  windowScale = function(){
    docEl.style.fontSize = docEl.getBoundingClientRect().width/pageWidth + 'px';
  }
  windowScale();
  window.onresize = windowScale;
})(window);

//���ֲ�
var  share = document.querySelector('.p5_share');
var divShare = document.querySelector('#share');
share.onclick = function(){
	document.querySelector('#share').style.display = 'block';	
}
divShare.onclick = function(){
	document.querySelector('#share').style.display = 'none';
}
//<!-----------------------change by 2016/1/30 start------------------------------>
//��ͣ�벥��
var audio = document.querySelector('audio');
var on_off = document.querySelector('#no_off');
on_off.onclick = function(){
	if (audio.paused){

           audio.play();

	}else{

           audio.pause();

       }
}
//<!-----------------------change by 2016/1/30 end------------------------------>