// ==UserScript==
// @name         User Mention Tools
// @description  Function used to tag everyone in a group on WhatsApp
// @version      1.2
// @author       Daniel Idalgo
// @match        https://web.whatsapp.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=web.whatsapp.com
// ==/UserScript==


/** @param {number} ms
 * @returns {Promise<void>}
*/

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

;(async function () {
  'use strict'
  let buffer = ''

  document.addEventListener('keyup', async (event) => {
    buffer += event.key
    buffer = buffer.slice(-2)

    if (buffer === '@@') {
      buffer = ''

      try {
        await tagEveryone()
      } catch (error) {
        alert(error.message)
        throw error
      }
    }

    if (buffer === '@!') {
      buffer = ''

      try {
        await returnGroupUsers()
      } catch (error) {
        alert(error.message)
        throw error
      }
    }

    if (buffer === '@#') {
      buffer = ''

      try {
        await tagList()
      } catch (error) {
        alert(error.message)
        throw error
      }
    }
  })

  function extractGroupUsers() {
    const groupSubtitle = document.querySelector('header .copyable-text').innerText
    const separator = groupSubtitle.includes('，') ? '，' : ','
    let groupUsers = groupSubtitle.split(separator)
    groupUsers = groupUsers.map((user) => user.trim())

    if (groupUsers.length === 1) {
      throw new Error(
        'Nenhum usuário encontrado. Tente novamente, as vezes os dados do grupo demoram para serem carregados.'
      )
    }

    groupUsers = groupUsers.filter(
      (user) =>
        [
          'You', // English
          '您', // Chinese
          'あなた', // Japanese
          'आप', // Hindi
          'Tu', // Spanish
          'Vous', // French
          'Du', // German
          'Jij', // Dutch
          'Você', // Portuguese
          'Вы' // Russian
        ].includes(user) === false
    )
    return groupUsers.map((user) => user.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
  }

  async function tagEveryone() {
    const groupUsers = extractGroupUsers()
    console.log(groupUsers)
    const chatInput = document.querySelectorAll('.copyable-area')[1].querySelector("p");

    for (const user of groupUsers) {

      document.execCommand('insertText', false, `@${user}`)
      await sleep(300)

      const keyboardEventMark = new KeyboardEvent('keydown', {
        key: 'Tab',
        code: 'Tab',
        keyCode: 9,
        which: 9,
        bubbles: true,
        cancelable: true
      })

      chatInput.dispatchEvent(keyboardEventMark)

      const keyboardEventBreak = new KeyboardEvent('keydown', {
        shiftKey: true,
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true
      })

      chatInput.dispatchEvent(keyboardEventBreak)
      document.execCommand('insertText', false, ' ')
    }
  }

    function returnGroupUsers() {
    const groupSubtitle = document.querySelector('header .copyable-text').innerText
    const separator = groupSubtitle.includes('，') ? '，' : ','

    let groupUsers = groupSubtitle.split(separator)
    groupUsers = groupUsers.map((user) => user.trim())

    if (groupUsers.length === 1) {
      throw new Error(
        'Nenhum usuário encontrado. Tente novamente, as vezes os dados do grupo demoram para serem carregados.'
      )
    }

    groupUsers = groupUsers.filter(
      (user) =>
        [
          'You', // English
          '您', // Chinese
          'あなた', // Japanese
          'आप', // Hindi
          'Tu', // Spanish
          'Vous', // French
          'Du', // German
          'Jij', // Dutch
          'Você', // Portuguese
          'Вы' // Russian
        ].includes(user) === false
    )

    const chatInput = document.querySelectorAll('.copyable-area')[1].querySelector("p");
    document.execCommand('insertText', false, groupUsers.map((user) => user.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))
  }

  async function tagList() {
    const chatInput = document.querySelectorAll('.copyable-area')[1].querySelector("p");
    const userList = prompt("Informe aqui a lista de telefones que deseja marcar:", "Exemplo: +55 11 11111-1111, +55 11 11111-1111")
    const separator = userList.includes('，') ? '，' : ','
    let groupUsers = userList.split(separator)
    groupUsers = groupUsers.map((user) => user.trim())

    for (const user of groupUsers) {

      document.execCommand('insertText', false, `@${user}`)
      await sleep(300)

      const keyboardEventMark = new KeyboardEvent('keydown', {
        key: 'Tab',
        code: 'Tab',
        keyCode: 9,
        which: 9,
        bubbles: true,
        cancelable: true
      })

      chatInput.dispatchEvent(keyboardEventMark)

      const keyboardEventBreak = new KeyboardEvent('keydown', {
        shiftKey: true,
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true
      })

      chatInput.dispatchEvent(keyboardEventBreak)
      document.execCommand('insertText', false, ' ')
    }
  }
})()
