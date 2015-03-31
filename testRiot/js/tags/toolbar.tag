<toolbar>

  <h1>{ title }</h1>

  <a id="left" onclick={ clicked }>
    hello
  </a>
  <div id="right">
    <inner-html \>
  </div>
 
  <!-- this script tag is optional -->
  <script>
    var self = this;
    self.title = opts.title;
    
    self.clicked =function(){
      self.title="hello";
    };

  </script>

</toolbar>



<actionarea>
  <h2> hello</h2>
</actionarea>

<inner-html>
  var p = this.parent.root;
  while (p.firstChild) this.root.appendChild(p.firstChild);
</inner-html>