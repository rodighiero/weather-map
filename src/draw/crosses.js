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
    stage.alpha = 1
    stage.name = 'crosses'
    s.viewport.addChild(stage)

    entities
        .filter(e => e['type'] !== 'subject') // Keep nodes
        .forEach(e => {

            // Cross

            const length = 3
            
            const line_1 = new Graphics()
            line_1.lineStyle(.5, 0x999999)
            line_1.moveTo(e.x, e.y - length)
            line_1.lineTo(e.x, e.y + length)
            stage.addChild(line_1)

            const line_2 = new Graphics()
            line_2.lineStyle(.5, 0x999999)
            line_2.moveTo(e.x - length, e.y)
            line_2.lineTo(e.x + length, e.y)
            stage.addChild(line_2)

        })

}