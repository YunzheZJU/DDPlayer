/**
 * Created by Yunzhe on 2018/9/1.
 */

'use strict';

export class Vector {
    constructor (a, b) {
        this.a = a;
        this.b = b;
    }

    scaleTo (length) {
        const factor = length / Math.sqrt(Math.pow(this.a, 2) + Math.pow(this.b, 2));
        this.scale(factor);

        return this;
    }

    scale (factor) {
        this.a *= factor;
        this.b *= factor;

        return this;
    }

    output () {
        return `${this.a},${this.b}`;
    }

    add (vector) {
        if (vector instanceof Vector) {
            this.a += vector.a;
            this.b += vector.b;
        } else {
            this.a += vector;
            this.b += vector;
        }

        return this;
    }

    minus (vector) {
        if (vector instanceof Vector) {
            this.a -= vector.a;
            this.b -= vector.b;
        } else {
            this.a -= vector;
            this.b -= vector;
        }

        return this;
    }

    multiply (value) {
        this.a *= value;
        this.b *= value;

        return this;
    }

    divide (value) {
        this.a /= value;
        this.b /= value;

        return this;
    }

    length () {
        return Math.sqrt(Math.pow(this.a, 2) + Math.pow(this.b, 2));
    }

    normalize () {
        return this.divide(this.length());
    }

    copy () {
        return new Vector(this.a, this.b);
    }
}

class Anchor {
    constructor (deg) {
        this.reg = Math.PI * deg / 180;
        this.main = new Vector(Math.cos(this.reg), Math.sin(this.reg));
        this.left = new Vector(Math.sin(this.reg), -Math.cos(this.reg));
        this.right = new Vector(-Math.sin(this.reg), Math.cos(this.reg));

        // 可能先生成点然后统一根据点间距去做锚点权重会比较好...
        // 现在这个样子太几把灵动了...
        this.left.scaleTo(Math.PI / (Math.random() * 18 + 8));
        this.right.scaleTo(Math.PI / (Math.random() * 18 + 8));

        this.left.add(this.main);
        this.right.add(this.main);
    }

    scale (factor) {
        this.left.scale(factor);
        this.main.scale(factor);
        this.right.scale(factor);

        return this;
    }
}

const points = [];

const POINTS_NUM = 10;

for (let i = 0; i < POINTS_NUM; i++) {
    points.push(new Anchor(360 / POINTS_NUM * (i - .25 + Math.random() * .5)));
}

export default points;