import { BitmapText, Circle, Graphics, Point, utils } from 'pixi.js'
import { descending } from 'd3'

import { click } from '../interface/click'

const splitInTwo = string => {
    const middle = Math.round(string.length / 2)
    for (let i = middle, j = middle; i < string.length || j >= 0; i++, j--) {
        if (string[i] === ' ') return string.substring(0, i) + '\n' + string.substring(i + 1)
        if (string[j] === ' ') return string.substring(0, j) + '\n' + string.substring(j + 1)
    }
    return string
}

export default (entities) => {

    const stage = new Graphics()
    stage.alpha = 0
    stage.name = 'nodes'
    s.viewport.addChild(stage)

    entities
        .filter(e => e['type'] !== 'subject') // Keep nodes
        .forEach(e => {

            // Label

            const text = new BitmapText(
                splitInTwo(e['name']),
                {
                    fontName: 'Lato',
                    fontSize: 3,
                    align: 'left',
                    tint: '0x000000',
                })
            text.position.set(e['x'], e['y'])
            stage.addChild(text)


            // Baseline

            const baseline = new Graphics()
            baseline.lineStyle(.1, '0x000000', 1);
            baseline.moveTo(e['x'] - 2, e['y'] + 0)
            baseline.lineTo(e['x'] - 0 + 20, e['y'] + 0)
            stage.addChild(baseline)


            // Temperature Line

            const length = 100 * parseFloat(e['frequency_norm'])
            const x_span = 1.2
            const y_span = 1
            const thickness = .6

            const line = new Graphics()
            if (e['slope'] > 0) {
                line.lineStyle(thickness, '0xEE0000', 1);
                line.moveTo(e['x'] - x_span, e['y'] - y_span)
                line.lineTo(e['x'] - x_span, e['y'] - y_span - length)
            } else {
                line.lineStyle(thickness, '0x2B64DD', 1);
                line.moveTo(e['x'] - x_span, e['y'] + y_span)
                line.lineTo(e['x'] - x_span, e['y'] + y_span + length)
            }
            stage.addChild(line)


            // Interactions

            text.hitArea = new Circle(0, 0, 100)
            text.interactive = true
            text.buttonMode = true

            // text.click = encodeURI => { click(e) } // On click

        })

}