import Scene from "../canvas/Scene";
import { deg2rad } from "../utils/MathUtils";
import { RotatingArc } from "../canvas/shapes/arcs";
import { RotatingClockwise } from "../canvas/shapes/clockwise";

const drawLine = (context, x, y, length, angle) => {
    context.save();
    context.beginPath();

    // offset + rotate
    context.translate(x, y);
    context.rotate(angle); // ! radian

    // draw line
    context.moveTo(-length / 2, 0);
    context.lineTo(length / 2, 0);
    context.stroke();

    context.closePath();
    context.restore();
};

export default class Scenario extends Scene {
    constructor(id) {
        super(id);

        // gradations
        this.drawGradation();

        // arcs
        this.arcs = [];
        const arcLengths = [3 / 4, 2 / 4]; // Lengths of the arcs
        this.nArcs = 2; // number of arcs
        arcLengths.forEach((length, i) => {
            const speed = Math.random() * 30 - 15; // Random speed between -15 and 15
            const clockwise_ = new RotatingClockwise(
                this.width / 2,
                this.height / 2,
                this.mainRadius + (i - (arcLengths.length - 1) / 2) * this.deltaRadius,
                i !== 0 ? deg2rad(Math.random() * 360) : 0,
                i !== 0 ? deg2rad(Math.random() * 360) : deg2rad(360),
                this.mainRadius * length, // Adjusting length
                speed // Assigning random speed to each arc
            );
            this.arcs.push(clockwise_);
        });

        // debug
        this.params["line-width"] = 2;
        this.params.color = "#ffffff";
        if (this.debug.active) {
            this.debugFolder
                .add(this.params, "line-width", 1, 10)
                .onChange(() => this.drawUpdate());
            this.debugFolder.addColor(this.params, "color");
            this.arcs.forEach((arc, index) => {
                this.debugFolder.add(arc, "speed", -15, 15, 0.25).name(`Arc ${index + 1} Speed`);
            });
        }

        // Start rotating immediately
        this.update();
    }

    resize() {
        super.resize();

        // main dimensions
        this.mainRadius = this.width < this.height ? this.width : this.height;
        this.mainRadius *= 0.5;
        this.mainRadius *= 0.7;
        this.deltaRadius = this.mainRadius * 0.075;

        // shapes update
        if (!!this.arcs) {
            this.arcs.forEach((e, index) => {
                e.x = this.width / 2;
                e.y = this.height / 2;
                e.radius =
                    this.mainRadius + (index - this.arcs.length / 2) * this.deltaRadius;
            });
        }

        // refresh
        this.drawUpdate();
    }

    update() {
        if (!super.update()) return;
        this.drawUpdate();
    } 

    drawUpdate() {
        this.clear();
        

        // style
        this.context.lineCap = "round";
        this.context.strokeStyle = this.params.color;
        this.context.lineWidth = this.params["line-width"];

        // draw outer circle
        this.context.beginPath();
        this.context.arc(
            this.width / 2,
            this.height / 2,
            this.mainRadius,
            0,
            Math.PI * 2
        );
        this.context.stroke();
        this.context.closePath();

        // draw
        this.drawGradation();
        if (!!this.arcs) {
            this.arcs.forEach((arc) => {
                if (this.params["is-update"]) arc.update(this.globalContext.time.delta / 1000, arc.speed); // Use arc-specific speed
                arc.draw(this.context);
            });
        }
    }

    drawGradation() {
        const nGradation_ = 12;
        const gradationRadius = this.mainRadius - this.deltaRadius / 2; // Radius for writing the hour number
        const textOffset = 30; // Offset for writing the hour number

        for (let i = 0; i < nGradation_; i++) {
            const angle_ = (2 * Math.PI * i) / nGradation_ + Math.PI / 2;
            const x_ = this.width / 2 + gradationRadius * Math.cos(angle_);
            const y_ = this.height / 2 + gradationRadius * Math.sin(angle_);
            const length_ = this.deltaRadius * 0.7;
            //drawLine(this.context, x_, y_, length_, angle_);

            // Writing hour number with offset
            const hour = ((i + 5) % 12) + 1; // Start writing from 1 to 12 instead of 0 to 11
            this.context.font = "20px Arial"; // Font settings
            this.context.textAlign = "center"; // Text alignment
            this.context.fillStyle = this.params.color; // Text color
            this.context.textBaseline = "middle"; // Text baseline alignment
            this.context.fillText(
                hour.toString(),
                x_ + textOffset * Math.cos(angle_),
                y_ + textOffset * Math.sin(angle_)
            );

            // Draw inner circle with offset
            this.context.beginPath();
            this.context.arc(
                x_ + textOffset * Math.cos(angle_),
                y_ + textOffset * Math.sin(angle_),
                20 ,
                0 ,
                Math.PI * 2
            );
            this.context.stroke();
            this.context.closePath();

            // Draw outer circle with offset
            this.context.beginPath();
            this.context.arc(
                this.width / 2,
                this.height / 2,
                this.mainRadius * 1.04 + textOffset,
                0,
                Math.PI * 2
            );
            this.context.stroke();
            this.context.closePath();
        }
    }
}
