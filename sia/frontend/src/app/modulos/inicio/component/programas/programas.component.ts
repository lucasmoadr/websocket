import { Component, AfterViewInit, Input, Renderer2, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-programas',
  templateUrl: './programas.component.html',
  styleUrls: ['./programas.component.css']
})
export class ProgramasComponent {
  posicionX: number = 0;
  posicionY: number = 0;
  posi:string[]=[];
  @Output() updatePosicion = new EventEmitter<string[]>();
  constructor() {
    this.makeDraggable.bind(this);

  }
  ngAfterViewInit() {
    this.makeDraggable(document.getElementById('svg'));

  }


  makeDraggable(evt) {
    var mouseX;
    var mouseY;
    var svg: any = evt;
    var thisComponent = this;
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
     svg.addEventListener('mouseleave', endDrag);


    var selectedElement, offset, transform, minX, maxX, minY, maxY, lastdx = 0, lastdy = 0;
    var tempIdCounter = 1;

    var lastResizeValues = {};
    function startDrag(evt) {
      if (evt.target.classList.contains('draggable')) {
        selectedElement = evt.target;
        initialiseDragging(evt);
      } else if (evt.target.classList.contains('resize-drag')) {
        selectedElement = evt.target;
        initialiseDragging(evt);
      }
      else if (evt.target.parentNode.classList.contains('draggable-group')) {
        selectedElement = evt.target.parentNode;
        initialiseDragging(evt);
      }
    }
    function initialiseDragging(evt) {
      offset = getMousePosition(evt);

      //Set boundaries
      var bbox = selectedElement.getBBox();
      let svgViewBox = svg.viewBox.baseVal;
      minX = svgViewBox.x - bbox.x;
      maxX = svgViewBox.width - bbox.x - bbox.width;
      minY = svgViewBox.y - bbox.y;
      maxY = svgViewBox.height - bbox.y - bbox.height;
      // Get all the transforms currently on this element
      var transforms = selectedElement.transform.baseVal;
      // Ensure the first transform is a translate transform
      if (transforms.length === 0 ||
        transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
        // Create an transform that translates by (0, 0)
        var translate = svg.createSVGTransform();
        translate.setTranslate(0, 0);
        // Add the translation to the front of the transforms list
        selectedElement.transform.baseVal.insertItemBefore(translate, 0);
      }
      // Get initial translation amount
      transform = transforms.getItem(0);
      offset.x -= transform.matrix.e;
      offset.y -= transform.matrix.f;
    }
    function drag(evt) {
      if (selectedElement) {
        evt.preventDefault();
        var coord = getMousePosition(evt);
        var dx = coord.x - offset.x;
        var dy = coord.y - offset.y;

        if (dx < minX) { dx = minX; }
        else if (dx > maxX) { dx = maxX; }
        if (dy < minY) { dy = minY; }
        else if (dy > maxY) { dy = maxY; }

        transform.setTranslate(dx, dy);
        //transform.setRotate(45, );
        if (evt.target.classList.contains('resize-drag')) {
          let containerElement = evt.target.parentNode.children[0];
          let isResized = containerElement.classList.contains('resized');

          if (isResized && lastdx == 0 && lastdy == 0) {
            let key = containerElement.classList[containerElement.classList.length - 1];
            let lastResize = lastResizeValues[key];
            lastdx = lastResize.dx;
            lastdy = lastResize.dy;
          }

          if (containerElement.tagName == "ellipse") {
            // let radiusChange = dx+dy > lastdx+lastdy ? 1.5 : -1.5;
            let radiusXChange = Number(containerElement.getAttribute('rx')) - lastdx + 20;
            containerElement.setAttribute('rx', radiusXChange + dx - 20);
            let radiusYChange = Number(containerElement.getAttribute('ry')) - lastdy + 20;
            containerElement.setAttribute('ry', radiusYChange + dy - 20);
          } else if (containerElement.tagName == "rect") {
            let initialWidth = Number(containerElement.getAttribute('width')) - lastdx + 20;
            let initialHeight = Number(containerElement.getAttribute('height')) - lastdy + 20;
            containerElement.setAttribute('width', initialWidth + dx - 20);
            containerElement.setAttribute('height', initialHeight + dy - 20);
          }
          if (!isResized) {
            containerElement.classList.add('resized');
            containerElement.classList.add('resize' + Object.keys(lastResizeValues).length);
            lastResizeValues['resize' + Object.keys(lastResizeValues).length] = { dx: dx, dy: dy };
          } else if (isResized) {
            let key = containerElement.classList[containerElement.classList.length - 1];
            lastResizeValues[key] = { dx: dx, dy: dy };
          }

          lastdx = dx;
          lastdy = dy;

        }
        //this.updatePosicion.emit(this.posicionX);

      }
    }
    function endDrag(evt) {

      this.posicionX = evt.pageX;
      this.posicionY = evt.pageY;

      selectedElement = null;
      lastdx = 0;
      lastdy = 0;
    }

    function getMousePosition(evt) {
      var CTM = svg.getScreenCTM();
      if (evt.touches) { evt = evt.touches[0]; }
      return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
      };
    }


  }
  position (event) {
    var ancho = screen.width;

    var alto = screen.height;

    var doc = window.document.getElementById('rectangulo');
    var svgDoc = window.document.getElementById('svg');
    var rec = window.document.getElementById('rec');
    //var vvvv = doc.getBBox();
    var offset = svgDoc.getBoundingClientRect();
    this.posi=[];
    /* var x =   Math.round(doc.getBoundingClientRect().right - rec.getBoundingClientRect().width / 10) * 10;
    var y =Math.round(doc.getBoundingClientRect().bottom - rec.getBoundingClientRect().height / 10) * 10; */
    this.posicionX = Math.round( doc.getBoundingClientRect().x / 10) * 10;
    this.posicionY =  Math.round(doc.getBoundingClientRect().y / 10) * 10;
    this.posi.push(this.posicionX.toString() );
    this.posi.push(this.posicionY.toString() );
    this.updatePosicion.emit(this.posi);

  }

}

