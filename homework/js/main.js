window.onload = function() {
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function(s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1;            
      };
  }
  eventDelegate('#list', '.bg', 'click', function(e) {
    e[0].target.style.display = 'none';
    e[0].target.parentNode.children[2].style.display = 'none';
    e[0].target.parentNode.children[2].children[1].children[0].value = '';
  });
  eventDelegate('#list', '.add-resource a,.add-resource i', 'click', function(e) {
    e[0].target.parentNode.parentNode.children[0].style.display = 'block';
    e[0].target.parentNode.parentNode.children[2].style.display = 'block';
  });
  eventDelegate('#list', '.add-resource-dialog .buttons .close', 'click', function(e) {
    e[0].target.parentNode.parentNode.parentNode.children[0].style.display = 'none';
    e[0].target.parentNode.parentNode.style.display = 'none';
    e[0].target.parentNode.parentNode.children[1].children[0].value = '';
  });
  eventDelegate('#list', '.add-resource-dialog .buttons .add', 'click', function(e) {
    e[0].target.parentNode.parentNode.parentNode.children[0].style.display = 'none';
    e[0].target.parentNode.parentNode.style.display = 'none';
    var value = e[0].target.parentNode.parentNode.children[1].children[0].value;
    addResource(value, e[0].target.parentNode.parentNode.parentNode.parentNode.children[2]);
    e[0].target.parentNode.parentNode.children[1].children[0].value = '';
  });
  eventDelegate('#list', '.resource-list .icon-cross', 'click', function(e) {
    var node = e[0].target.parentNode,
      parent = e[0].target.parentNode.parentNode;
    parent.removeChild(node);
  });
}

function addResource(value, node) {
  var items = value.split(',');
  var htmlStr = '';
  items.forEach(function(item) {
    if(item.trim() !== '') {
      htmlStr = htmlStr + '<span>' + item + '<i class="icon-cross"></i></span>';
    }
  });
  node.insertAdjacentHTML('beforeend', htmlStr);
}

function eventDelegate (parentSelector, targetSelector, events, callback) {
  // 触发执行的函数
  function triFunction (e) {
    // 兼容性处理
    var event = e || window.event;

    // 获取到目标阶段指向的元素
    var target = event.target || event.srcElement;

    // 获取到代理事件的函数
    var currentTarget = event.currentTarget;

    // 遍历外层并且匹配
    while (target && target !== currentTarget) {
      // 判断是否匹配到我们所需要的元素上
      if (target.matches(targetSelector)) {
        var sTarget = target;
        // 执行绑定的函数，注意 this
        callback.call(sTarget, Array.prototype.slice.call(arguments));
      }

      target = target.parentNode;
    }
  }

  // 如果有多个事件的话需要全部一一绑定事件
  events.split('.').forEach(function (evt) {
    // 多个父层元素的话也需要一一绑定
    Array.prototype.slice.call(document.querySelectorAll(parentSelector)).forEach(function ($p) {
      $p.addEventListener(evt, triFunction);
    });
  });
}