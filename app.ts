import { bootstrap } from 'angular2/platform/browser';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from 'angular2/core';
import { NgFor } from 'angular2/common';
import * as $ from 'jquery';

@Component({
  selector: 'app',
  template: `
    <div
      (dragover)="false"
      (dragend)="false"
      (drop)="handleDrop($event)"
      style="height: 300px; border: 5px dotted #ccc;">
      <p id="titulo" style="margin: 10px; text-align: center">
        <strong>Drop Your Images Here</strong>
      </p>
      <div id="element" class="removeThisClass">HELLO THERE</div>
      <input id="button" type="button" value="Click Me" />
    </div>
  `
})

export class App implements OnInit {
  
  constructor() { 
    this.animateDivers();
  }

  handleDrop(e) {
    
    var files: File = e.dataTransfer.files;
    Object.keys(files).forEach((key) => {
      console.log(files[key]);
    });

    return false;
  }


  ngOnInit() {
    $('#titulo').animate({scrollLeft: 100}, 500);
    $("#titulo").click(function () {
      $('#titulo').animate({scrollLeft: 100}, 500);
    });
  }

   animateDivers() {
        //  $("#element").switchClass("removeThisClass", "addThisClass", 2000).animateDivers(); 
          $('#element').animate({'border-color':'#006700'},150).animate({'border-color':'#24C72A'},150, this.animateDivers());
          
    }




}






bootstrap(App);
