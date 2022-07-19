export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint)
    .then(data => data.json())
    .then(({ login, name, public_repos, followers}) => ({
      login, 
      name,
      public_repos,
      followers
    }))
  }
}

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)

    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  async add(username) {
    const user = await GithubUser.search(username)
    this.entries = [user, ...this.entries]
    this.update()
    this.save()
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.addUser()
    this.update()
    this.save()
  }

  update() {
    this.removeAllTr()

    this.entries.forEach(entry => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${entry.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${entry.login}`
      row.querySelector('.user a').href = `https://github.com/${entry.login}`
      row.querySelector('.user a p').textContent = `${entry.name}`
      row.querySelector('.user a span').textContent = `${entry.login}`
      row.querySelector('.repositories').textContent = `${entry.public_repos}`
      row.querySelector('.followers').textContent = `${entry.followers}`

      this.tbody.append(row)
    })
  }

  addUser() {
    const addButton = this.root.querySelector('.add-user')

    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')
      this.add(value)
    }
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach(row => {
      row.remove()
    })
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
    <td class="user">
      <img src="" alt="">
      <a href="" target="_blank">
        <p></p>
        <span></span>
      </a>
    </td>
    <td class="repositories"></td>
    <td class="followers"></td>
    <td>
      <button class="remove">&times;</button>
    </td>
    `

    return tr
  }
}