let storedDate
let settingsOpen = false

let showQuotes = true
let militaryTime = true

const toBool = (value) => {
	return (value === "true") ? true : false
}

const settingsToggle = () => {
	if (!settingsOpen) {
		const marginSpacing = "10px"
		settingsOpen = true

		document.querySelector("#content").remove()
		document.querySelector("#settingsIcon").style.marginBottom = "5%"

		const heading = document.createElement("p")
			heading.id = "settingsHeader"
			heading.innerText = "Settings"
			heading.style.marginBottom = "20px"

		// Settings
		const settingsDiv = document.createElement("div")
			settingsDiv.id = "settingsDiv"

		const backgroundColourLabel = document.createElement("p")
			backgroundColourLabel.innerText = "Background Colour"
			backgroundColourLabel.style.marginBottom = marginSpacing
			backgroundColourLabel.onclick = () => {
				document.querySelector("#backgroundColour").click()
			}

		const backgroundImageLabel = document.createElement("p")
			backgroundImageLabel.innerText = "Background Image (url):"
			backgroundImageLabel.id = "backgroundImageLabel"
			backgroundImageLabel.style.cursor = "text"
		const backgroundImage = document.createElement("input")
			backgroundImage.type = "text"
			backgroundImage.id = "backgroundImage"
			backgroundImage.style.marginBottom = marginSpacing

		const textColourLabel = document.createElement("p")
			textColourLabel.innerText = "Text Colour: "
			textColourLabel.style.marginBottom = marginSpacing
			textColourLabel.onclick = () => {
				document.querySelector("#textColour").click()
			}

		const hourToggleLabel = document.createElement("p")
			hourToggleLabel.innerText = (militaryTime) ? "24 Hour Toggle (on)" : "24 Hour Toggle (off)"
			hourToggleLabel.style.marginBottom = marginSpacing
			hourToggleLabel.onclick = () => {
				militaryTime = (militaryTime) ? false : true
				hourToggleLabel.innerText = (militaryTime) ? "24 Hour Toggle (on)" : "24 Hour Toggle (off)"

				localStorage.setItem("militaryTime", militaryTime)
			}

		const quoteToggleLabel = document.createElement("p")
			quoteToggleLabel.innerText = (showQuotes) ? "Quote Toggle (on)" : "Quote Toggle (off)"
			quoteToggleLabel.style.marginBottom = marginSpacing
			quoteToggleLabel.onclick = () => {
				showQuotes = (showQuotes) ? false : true
				quoteToggleLabel.innerText = (showQuotes) ? "Quote Toggle (on)" : "Quote Toggle (off)"

				localStorage.setItem("showQuotes", showQuotes)
			}

		const resetButton = document.createElement("p")
			resetButton.id = "reset"
			resetButton.innerText = "Reset all"
			resetButton.style.textDecoration = "underline"
			resetButton.onclick = () => {
				localStorage.clear()

				document.querySelector("html").style.backgroundColor = ""
				document.querySelector("html").style.backgroundImage = ""
				document.querySelector("html").style.color = ""
			}

		settingsDiv.appendChild(heading)
		settingsDiv.appendChild(backgroundColourLabel)
		settingsDiv.appendChild(backgroundImageLabel)
		settingsDiv.appendChild(backgroundImage)
		settingsDiv.appendChild(textColourLabel)
		settingsDiv.appendChild(hourToggleLabel)
		settingsDiv.appendChild(quoteToggleLabel)
		settingsDiv.appendChild(resetButton)

		document.querySelector("body").appendChild(settingsDiv)

		document.querySelector("#backgroundColour").addEventListener("change", (event) => {
			document.querySelector("html").style.backgroundColor = event.target.value

			localStorage.setItem("backgroundColour", event.target.value)
			localStorage.removeItem("backgroundImage")

			document.querySelector("html").style.backgroundImage = null
		})
		document.querySelector("#textColour").addEventListener("change", (event) => {
			document.querySelector("html").style.color = event.target.value
			localStorage.setItem("textColour", event.target.value)
		})
		document.querySelector("#backgroundImage").addEventListener("change", (event) => {
			document.querySelector("html").style.backgroundImage = `url("${event.target.value}")`
			localStorage.setItem("backgroundImage", event.target.value)
			localStorage.removeItem("backgroundColour")

			localStorage.removeItem("backgroundColour")
			document.querySelector("html").style.backgroundColor = null
		})
	} else {
		const content = document.createElement("div")
			content.id = "content"

		const time = document.createElement("p")
			time.id = "time"
		const date = document.createElement("p")
			date.id = "date"

		const quoteContainer = document.createElement("div")
			quoteContainer.id = "quoteContainer"
		const quote = document.createElement("p")
			quote.id = "quote"
		const author = document.createElement("p")
			author.id = "author"

		quoteContainer.appendChild(quote)
		quoteContainer.appendChild(author)

		content.appendChild(time)
		content.appendChild(date)
		content.appendChild(quoteContainer)

		document.querySelector("#settingsIcon").style.marginBottom = "15%"
		document.querySelector("#settingsDiv").remove()
		document.querySelector("body").appendChild(content)

		settingsOpen = false

		updateTime()
		updateDate()
		newQuote()
	}
}

const updateTime = () => {
	const date = new Date()

	if (militaryTime) {
		const hour = (date.getHours() < 10) ? `0${date.getHours()}` : date.getHours()
		const minute = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes()

		document.getElementById("time").innerText = `${hour}:${minute}`
	} else {
		let hour = (12 > date.getHours()) ? 12 - date.getHours() : date.getHours() - 12
		const minute = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes()

		if (hour < 10) hour = `0${hour.toString()}`
		document.getElementById("time").innerText = `${hour}:${minute}`
	}
	storedDate = date
}

const updateDate = () => {
	const date = new Date()

	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

	storedDate = date
	document.getElementById("date").innerText = `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

const newQuote = async () => {
	if (showQuotes) {
		let quoteData = {
			quote: "",
			author: ""
		}

		await fetch("https://api.quotable.io/quotes/random")
			.then(res => res.json())
			.then((res) => {
				quoteData.quote = res[0].content
				quoteData.author = res[0].author
			})

		document.getElementById("quote").innerText = `"${quoteData.quote}"`
		document.getElementById("author").innerText = `- ${quoteData.author}`
	}
}

window.onload = () => {
	console.log("Quotes from https://quotable.io")

	if (localStorage.getItem("militaryTime") != null) militaryTime = toBool(localStorage.getItem("militaryTime"))
	if (localStorage.getItem("showQuotes") != null) showQuotes = toBool(localStorage.getItem("showQuotes"))

	if (localStorage.getItem("backgroundColour") != null) {
		document.querySelector("html").style.backgroundColor = localStorage.getItem("backgroundColour")
	} else if (localStorage.getItem("backgroundImage") != null) {
		document.querySelector("html").style.backgroundImage = `url("${localStorage.getItem("backgroundImage")}")`
	}
	document.querySelector("html").style.color = localStorage.getItem("textColour")

	updateTime()
	updateDate()
	newQuote()

	setInterval(() => {
		const date = new Date()

		if (!settingsOpen) {
			if (storedDate.getMinutes() != date.getMinutes() || storedDate.getHours() != date.getHours()) { updateTime() }
			if (storedDate.getDate() != date.getDate()) { updateDate() }
		}
	}, 100)

	setInterval(() => {
		newQuote()
	}, 600000)

	document.querySelector("#settingsIcon").addEventListener("click", settingsToggle)
}