import { BitmapText, Graphics } from 'pixi.js'
import { descending, mean } from 'd3'

export default entities => {

    const stage = new Graphics()
    stage.name = 'keywords'
    stage.interactiveChildren = false
    s.viewport.addChild(stage)

    let harvest = [] // Collector for visible keywords

    // console.log(entities.length)

    entities
        .filter(e => e['type'] === 'subject') // Keep keywords
        .forEach(e => {

            const bitmap = new BitmapText(
                e['name'],
                {
                    fontName: 'Lato',
                    fontSize: (parseFloat(e['frequency_norm']) + .6) * 16, // Normalization ([0:1] + x) + scale
                    tint: 0x999999,
                    align: 'center',
                })

            bitmap.position.set(e['x'] - bitmap.textWidth / 2, e['y'] - bitmap.textHeight / 2)


            let overlapping = false // Check overlapping

            for (var i = 0; i < harvest.length; i++) {

                const l1 = harvest[i]
                const l2 = bitmap
                const margin = 15 // Avoid close keywords

                if (!(l2.x > l1.x + l1.width + margin
                    || l2.x + l2.width + margin < l1.x
                    || l2.y > l1.y + l1.height + margin
                    || l2.y + l2.height + margin < l1.y)) {
                    overlapping = true // This is black magic
                    break
                }

            }

            if (!overlapping) {  // Draw contour to verify

                stage.addChild(bitmap)
                harvest.push(bitmap)

                // const rect_2 = new Graphics();
                // rect_2.lineStyle(.5, 0x00FF00, .6)
                // rect_2.drawRoundedRect(bitmap.x, bitmap.y, bitmap.textWidth, bitmap.textHeight, 1)
                // rect_2.endFill()
                // stage.addChild(rect_2)

            }

        })

}
