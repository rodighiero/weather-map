import { BitmapText, Circle, Graphics, Rectangle } from 'pixi.js'

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
    stage.name = 'elements'
    s.viewport.addChild(stage)

    entities
        // .filter(e => e['type'] !== 'subject') // Keep nodes
        .forEach(e => {

            const isSubject = e['type'] == 'subject'

            const color = isSubject ? s.gray : e['slope'] > 0 ? s.red : s.blue

            // Cross

            const length = isSubject ? 1 : 2

            const line_1 = new Graphics()
            line_1.lineStyle(.5, color)
            line_1.moveTo(e.x, e.y - length)
            line_1.lineTo(e.x, e.y + length)
            stage.addChild(line_1)

            const line_2 = new Graphics()
            line_2.lineStyle(.5, color)
            line_2.moveTo(e.x - length, e.y)
            line_2.lineTo(e.x + length, e.y)
            stage.addChild(line_2)

            // Label

            const bitmap = new BitmapText(
                splitInTwo(e['name']),
                {
                    fontName: 'Lato',
                    fontSize: 2,
                    align: 'left',
                    tint: isSubject ? s.gray : '0x000000',
                })
                bitmap.position.set(e.x + 1.2, e.y + .6)
            stage.addChild(bitmap)


            // Interaction

            bitmap.hitArea = new Rectangle(0, 0, bitmap.textWidth, bitmap.textHeight)
            bitmap.interactive = true
            bitmap.buttonMode = true

            bitmap.click = event => { click(e) } // On click


            // Baseline

            // const baseline = new Graphics()
            // baseline.lineStyle(.1, '0x000000', 1);
            // baseline.moveTo(e['x'] - 2, e['y'] + 0)
            // baseline.lineTo(e['x'] - 0 + 20, e['y'] + 0)
            // stage.addChild(baseline)


            // Temperature Line

            // const length = 100 * parseFloat(e['frequency_norm'])
            // const x_span = 1.2
            // const y_span = 1
            // const thickness = .6

            // const line = new Graphics()
            // if (e['slope'] > 0) {
            //     line.lineStyle(thickness, '0xEE0000', 1);
            //     line.moveTo(e['x'] - x_span, e['y'] - y_span)
            //     line.lineTo(e['x'] - x_span, e['y'] - y_span - length)
            // } else {
            //     line.lineStyle(thickness, '0x2B64DD', 1);
            //     line.moveTo(e['x'] - x_span, e['y'] + y_span)
            //     line.lineTo(e['x'] - x_span, e['y'] + y_span + length)
            // }
            // stage.addChild(line)



        })

}