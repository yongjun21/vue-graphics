/* eslint-env jest */
import {mount} from '@vue/test-utils'

import {AnimatedBar, AnimatedLine} from '../index'
import * as dep from '../util'

describe('AnimatedBar', () => {
  const propsData = {x: 1, y: 2, width: 3, height: 4}

  testAnimatedElement(AnimatedBar, propsData, {x: 2})

  test('attributes update when props changed', done => {
    const wrapper = mountHelper(AnimatedBar, propsData)
    const newProps = {x: 2, y: 3, width: 4, height: 5}
    wrapper.setProps(newProps)
    setTimeout(() => {
      const attrs = wrapper.attributes()
      Object.keys(newProps).forEach(prop => {
        expect(attrs).toHaveProperty(prop, newProps[prop].toString())
      })
      done()
    }, wrapper.vm.duration * 1000 + 100)
  })
})

describe('AnimatedLine', () => {
  const propsData = {d: 'M0 L99,0'}
  dep.createSVGElement = function (tag) {
    const $el = document.createElement(tag)
    $el.getTotalLength = () => 99
    return $el
  }

  testAnimatedElement(AnimatedLine, propsData, {d: 'M0 L0,99'})

  test('initialize line hidden', () => {
    const wrapper = mountHelper(AnimatedLine, propsData)
    const attrs = wrapper.attributes()
    expect(attrs).toHaveProperty('stroke-dasharray', '99')
    expect(attrs).toHaveProperty('stroke-dashoffset', '99')
  })

  test('line enters', done => {
    const wrapper = mountHelper(AnimatedLine, propsData)
    setTimeout(() => {
      expect(wrapper.attributes()['stroke-dashoffset']).toEqual('0')
      done()
    }, wrapper.vm.duration * 1000 + 100)
  })

  test('line switch back to hidden when props changed', () => {
    const wrapper = mountHelper(AnimatedLine, propsData)
    wrapper.setProps({d: 'M0 L0,99'})
    expect(wrapper.attributes()['stroke-dashoffset']).toEqual('99')
  })

  test('line re-enters', done => {
    const wrapper = mountHelper(AnimatedLine, propsData)
    setTimeout(() => {
      wrapper.setProps({d: 'M0 L0,99'})
    }, 100)
    setTimeout(() => {
      expect(wrapper.attributes()['stroke-dashoffset']).toEqual('0')
      done()
    }, wrapper.vm.duration * 1000 + 200)
  })
})

function testAnimatedElement (Component, propsData, propsChange) {
  test('proxy props to dom', () => {
    const wrapper = mountHelper(Component, propsData)
    const attrs = wrapper.attributes()
    Object.keys(propsData).forEach(prop => {
      expect(attrs).toHaveProperty(prop, propsData[prop].toString())
    })
  })

  test('proxy listeners to dom', () => {
    const clickHandler = jest.fn()
    const mountOptions = {listeners: {click: clickHandler}}
    const wrapper = mountHelper(Component, propsData, mountOptions)
    wrapper.trigger('click')
    expect(clickHandler).toBeCalled()
  })

  test('has a duration property', () => {
    const wrapper = mountHelper(Component, propsData)
    expect(wrapper.vm).toHaveProperty('duration')
  })

  test('expose a .animate() method', () => {
    const wrapper = mountHelper(Component, propsData)
    expect(wrapper.vm).toHaveProperty('animate')
    expect(wrapper.vm.animate).toBeInstanceOf(Function)
  })

  test('.animate() called when props changed', () => {
    const wrapper = mountHelper(Component, propsData)
    const animateSpy = jest.spyOn(wrapper.vm, 'animate')
    wrapper.setProps(propsChange)
    expect(animateSpy).toBeCalled()
  })

  test('.animate() not called if auto prop is set to false', () => {
    const wrapper = mountHelper(Component, Object.assign({auto: false}, propsData))
    const animateSpy = jest.spyOn(wrapper.vm, 'animate')
    wrapper.setProps(propsChange)
    expect(animateSpy).not.toBeCalled()
  })
}

function mountHelper (Component, propsData, otherOptions) {
  propsData = Object.assign({}, propsData)
  const options = Object.assign({propsData}, otherOptions)
  return mount(Component, options)
}
