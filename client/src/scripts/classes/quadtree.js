class Point {
      constructor(x,y, entity) {
          this.x = x
          this.y = y
          this.entity = entity
      }
  }

class Rectangle {
      constructor(x,y,w,h) {
          this.x = x
          this.y = y 
          this.w = w
          this.h = h
      }

      contains(point) {
          return (point.x >= this.x - this.w &&
              point.x <= this.x + this.w &&
              point.y >= this.y - this.h &&
              point.y <= this.y + this.h)
      }

      intersects(range) {
          return (this.x - this.w < range.x + range.w &&
                  this.x + this.w > range.x - range.w &&
                  this.y - this.h < range.y + range.h  &&
                  this.y + this.h > range.y - range.h )
      }
  }

class Circle {
      constructor(x,y,r)
      {
          this.x = x
          this.y = y
          this.r = r
          this.rSquared = r * r
      }
      contains(point) {
          // check if the point is in the circle by checking if the euclidean distance of
          // the point and the center of the circle if smaller or equal to the radius of
          // the circle
          let d = Math.pow((point.x - this.x), 2) + Math.pow((point.y - this.y), 2);
          return d <= this.rSquared;
        }

      intersects(range) {

          var xDist = Math.abs(range.x - this.x);
          var yDist = Math.abs(range.y - this.y);
      
          // radius of the circle
          var r = this.r;
      
          var w = range.w;
          var h = range.h;
      
          var edges = Math.pow((xDist - w), 2) + Math.pow((yDist - h), 2);
      
          // no intersection
          if (xDist > (r + w) || yDist > (r + h))
            return false;
      
          // intersection within the circle
          if (xDist <= w || yDist <= h)
            return true;
      
          // intersection on the edge of the circle
          return edges <= this.rSquared;
        }
  }

class QuadTree {
      constructor(boundary, capacity) {
          if (!boundary) {
            throw TypeError('boundary is null or undefined');
          }
          if (!(boundary instanceof Rectangle)) {
            throw TypeError('boundary should be a Rectangle');
          }
          if (typeof capacity !== 'number') {
            throw TypeError(`capacity should be a number but is a ${typeof capacity}`);
          }
          if (capacity < 1) {
            throw RangeError('capacity must be greater than 0');
          }
          this.boundary = boundary;
          this.capacity = capacity;
          this.points = [];
          this.divided = false;
        }
      
        subdivide() {
          let x = this.boundary.x;
          let y = this.boundary.y;
          let w = this.boundary.w / 2;
          let h = this.boundary.h / 2;
      
          let ne = new Rectangle(x + w, y - h, w, h);
          this.ne = new QuadTree(ne, this.capacity);
          let nw = new Rectangle(x - w, y - h, w, h);
          this.nw = new QuadTree(nw, this.capacity);
          let se = new Rectangle(x + w, y + h, w, h);
          this.se = new QuadTree(se, this.capacity);
          let sw = new Rectangle(x - w, y + h, w, h);
          this.sw = new QuadTree(sw, this.capacity);
      
          this.divided = true;
        }
      
        insert(point) {
          if (!this.boundary.contains(point)) {
            return false;
          }
      
          if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
          }
      
          if (!this.divided) {
            this.subdivide();
          }
      
          if (this.ne.insert(point) || this.nw.insert(point) ||
            this.se.insert(point) || this.sw.insert(point)) {
            return true;
          }
        }
      
        query(range, found) {
          if (!found) {
            found = [];
          }
      
          if (!range.intersects(this.boundary)) {
            return found;
          }
      
          for (let p of this.points) {
            if (range.contains(p)) {
              found.push(p);
            }
          }
          if (this.divided) {
            this.nw.query(range, found);
            this.ne.query(range, found);
            this.sw.query(range, found);
            this.se.query(range, found);
          }
      
          return found;
        }

      // show() {
      //     stroke(0);
      //     strokeWeight(1)
      //     noFill();
      //     rectMode(CENTER)
      //     rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2)
      //     if (this.divided) {
      //         this.ne.show();
      //         this.nw.show();
      //         this.se.show();
      //         this.sw.show();
      //     }

      //     for (let p of this.points) {
      //         strokeWeight(4);
      //         point(p.x, p.y)
      //     }
      // }
  }

  export {
    Point,
    Rectangle,
    Circle,
    QuadTree
  }