let dogModal = $('#modal')
let ninjaApiInfo1 = $('.ninja-api-information1')
let ninjaApiInfo2 = $('.ninja-api-information2')
let modalCloseButton = $('.close-modal')
let favoritesArray = JSON.parse(localStorage.getItem('favoriteDogs'))



async function fetchToken() {
  const url = 'https://api.petfinder.com/v2/oauth2/token';
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', 'mU30JwOsjFnaW6kDyLIZbU944L4ibtzuYzDYY9a2ahgIrqXE13');
  params.append('client_secret', 'XxZh8h5wx3baDaYym4AnbuH3FpPBCvfmEDhNO4Eu');

  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  })
  let data = await res.json();
  return data['access_token']
}


    
function fetchFavoritesFromLocal() {
  let favoriteDogsArray = JSON.parse(localStorage.getItem('favoriteDogs'))
  console.log(JSON.stringify(favoriteDogsArray))

  for (let i = 0; i<favoriteDogsArray.length; ++i) {
    fetchFavorites(favoriteDogsArray[i])
  }
}
    
$(function() {
  fetchFavoritesFromLocal();
})
    
    
function createFavoriteCard(dog) {
  
   //Creates dog cards for the amount of dogs in the array that is fetched from petfinder API
     //Gets the .dog-cards div from the HTML and assigns it to dogCardDiv
     let dogCardDiv = $('.dog-cards');
 
     //Creates the card for the dog and assigns classes for formatting
     let dogCard = $('<div>').addClass('dog-card flex flex-col justify-center h-80 w-80')
 
     //Creates the image div within the dog card div and formats it
     let dogImageDiv = $('<div>').addClass('h-full overflow-hidden rounded-xl mr-2 ml-2')
     
     //Creates the image container, adds the photo of the dog from the array, and formats it
     let dogImage = $('<img>').attr('src', dog.animal.photos[0].full).addClass('h-full w-full')
   
     //Appends the variables above to the respective containers
     dogCard.append(dogImageDiv)
     dogImageDiv.append(dogImage)
     dogCardDiv.append(dogCard)
 
     //Adds an event handler to the dog cards to open the modal
     dogCard.on('click', function() {
       //Hides the background when modal opens
       $('.main-container').removeClass('flex').addClass('hidden')
       $('body').css('background-image', 'none');
       $('body').addClass('bg-sky-100')
 
       //Accesses elements from the HTML
       let dogModalName = $('.dog-name');
       let dogModalImage = $('.dog-image')
       let dogModalDescription = $('.dog-description');
       let dogBreed = $('.dog-breed-info');
       let dogAge = $('.dog-age-info');
       let email = $('.dog-email-info');
       let phone = $('.dog-phone-info');
       let dateAdded = $('.dateAdded');  
       let favoritesDiv = $('.favorites')
       let id = dog.animal.id
 
       //Resets NinjaAPI information
       ninjaApiInfo1.text('')
       ninjaApiInfo2.text('')
 
       //Adds dog name and description to the modal
       dogModalName.text(dog.animal.name)
       dogModalDescription.text(dog.animal.description)
 
       //Adds dog breed, age, email, phone, and published date to the modal
       dogBreed.text('').append(`${dog.animal.breeds.primary}`)
       dogAge.text('').append(`${dog.animal.age}`)
       email.text('').append(`${dog.animal.contact.email}`)
       phone.text('').append(`${dog.animal.contact.phone}`)
       dateAdded.text('').append(` Published on ${dayjs(dog.animal.published_at).format('MM/DD/YYYY')}`)
 
       //Adds a photo of the dog to the modal
       dogModalImage.attr('src', dog.animal.photos[0].full)
 
       favoritesDiv.empty();
       let favoritesButton = $('<button>').addClass('mr-10 p-2 border-2 border-zinc-900').text('Favorite')
       favoritesDiv.append(favoritesButton)
 
       if (favoritesArray.includes(id)) {
         favoritesButton.addClass('bg-yellow-600')
       }
 
 
 
       favoritesButton.on('click', function() {
        if (favoritesArray.includes(id)) {
          let indexOfId = favoritesArray.indexOf(id)
          favoritesArray.splice(indexOfId, 1)
          console.log(favoritesArray)
          
          favoritesButton.removeClass('bg-yellow-600')

          localStorage.setItem('favoriteDogs', JSON.stringify(favoritesArray))

          window.location.reload();
         }
       })
       
 
 
 
 
       //Fetchs the NinjaAPI information toa dd to the modal
       fetchDogInformation(dog.animal.breeds.primary)
 
       //Shows the modal
       dogModal.show();
     })
   }  

    
    
    
async function fetchFavorites (id) {
  let token = await fetchToken();
  
  let url = `https://api.petfinder.com/v2/animals/${id}`

  let res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  let data = await res.json()
  console.log(data)
  createFavoriteCard(data)
}




async function fetchDogInformation(name) {
  try {
      const response = await fetch('https://api.api-ninjas.com/v1/dogs?name=' + encodeURIComponent(name), {
          method: 'GET',
          headers: {
              'X-Api-Key': 'gbWmZrUovo5MdfRw15NJFA==ZZxzVph1f8g2nr87',
              'Content-Type': 'application/json'
          }
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const result = await response.json();
      dogNinjaApiName(result);
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      noInformationFound()
  }
}



function dogNinjaApiName (dogs) {
  
  let dogBarkingLevel = $('<p>');
  dogBarkingLevel.text(`Barking Level: ${dogs[0].barking}/5`)

  let dogEnergyLevel =  $('<p>');
  dogEnergyLevel.text(`Energy Level: ${dogs[0].energy}/5`)

  let dogPlayfulness = $('<p>')
  dogPlayfulness.text(`Playfulness: ${dogs[0].playfulness}/5`)

  let goodWithStrangers = $('<p>')
  goodWithStrangers.text(`Good w/ Strangers: ${dogs[0].good_with_strangers}/5`)
  
  let goodWithDogs = $('<p>')
  goodWithDogs.text(`Good w/ Dogs: ${dogs[0].good_with_other_dogs}/5`)

  let goodWithChildren = $('<p>')
  goodWithChildren.text(`Good w/ Children: ${dogs[0].good_with_children}/5`)
  
  ninjaApiInfo1.append(dogBarkingLevel)
  ninjaApiInfo1.append(dogEnergyLevel)
  ninjaApiInfo1.append(dogPlayfulness)

  ninjaApiInfo2.append(goodWithStrangers)
  ninjaApiInfo2.append(goodWithDogs)
  ninjaApiInfo2.append(goodWithChildren)
}

//Adds N/A to the NinjaAPI container if the dog breed can't be found via the API
function noInformationFound() {
  let dogBarkingLevel = $('<p>');
  dogBarkingLevel.text(`Barking Level: N/A`)

  let dogEnergyLevel =  $('<p>');
  dogEnergyLevel.text(`Energy Level: N/A`)

  let dogPlayfulness = $('<p>')
  dogPlayfulness.text(`Playfulness: N/A`)

  let goodWithStrangers = $('<p>')
  goodWithStrangers.text(`Good w/ Strangers: N/A`)
  
  let goodWithDogs = $('<p>')
  goodWithDogs.text(`Good w/ Dogs: N/A`)

  let goodWithChildren = $('<p>')
  goodWithChildren.text(`Good w/ Children: N/A`)
  
  ninjaApiInfo1.append(dogBarkingLevel)
  ninjaApiInfo1.append(dogEnergyLevel)
  ninjaApiInfo1.append(dogPlayfulness)

  ninjaApiInfo2.append(goodWithStrangers)
  ninjaApiInfo2.append(goodWithDogs)
  ninjaApiInfo2.append(goodWithChildren)
}



//Closes modal when X button is pressed in top right of modal, as well as 
modalCloseButton.on('click', function() {
  dogModal.hide();

  //Unhides the content that was hidden from opening the modal
  $('.main-container').removeClass('hidden').addClass('flex')
  $('body').removeClass('bg-sky-100')
  $('body').css('background-image', 'url("/assets/images/field-of-grass-1362858.jpg")');
  window.location.reload();
})

//Closes modal when esc is pressed
$(document).keydown(function(event) {
  if (event.key == 'Escape') {
    dogModal.hide(); 
    
    //Unhides the content that was hidden from opening the modal
    $('.main-container').removeClass('hidden').addClass('flex')
    $('body').removeClass('bg-sky-100')
    $('body').css('background-image', 'url("/assets/images/field-of-grass-1362858.jpg")');
  } 
});

