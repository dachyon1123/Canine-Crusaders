const commonDogBreedsAlphabetical = [
  'Affenpinscher',
  'Afghan Hound',
  'Airedale Terrier',
  'Akita',
  'Alaskan Malamute',
  'American Bulldog',
  'American Cocker Spaniel',
  'American Eskimo Dog',
  'American Foxhound',
  'American Pit Bull Terrier',
  'American Staffordshire Terrier',
  'American Water Spaniel',
  'Anatolian Shepherd Dog',
  'Australian Cattle Dog',
  'Australian Shepherd',
  'Australian Terrier',
  'Basenji',
  'Basset Hound',
  'Beagle',
  'Bearded Collie',
  'Bedlington Terrier',
  'Belgian Malinois',
  'Bernese Mountain Dog',
  'Bichon Frise',
  'Black and Tan Coonhound',
  'Bloodhound',
  'Border Collie',
  'Border Terrier',
  'Borzoi',
  'Boston Terrier',
  'Boxer',
  'Boykin Spaniel',
  'Brittany',
  'Brussels Griffon',
  'Bulldog',
  'Bullmastiff',
  'Cairn Terrier',
  'Cane Corso',
  'Cardigan Welsh Corgi',
  'Cavalier King Charles Spaniel',
  'Chesapeake Bay Retriever',
  'Chihuahua',
  'Chinese Crested',
  'Chinese Shar-Pei',
  'Chow Chow',
  'Clumber Spaniel',
  'Cocker Spaniel',
  'Collie',
  'Curly-Coated Retriever',
  'Dachshund',
  'Dalmatian',
  'Doberman Pinscher',
  'Dogue de Bordeaux',
  'English Bulldog',
  'English Cocker Spaniel',
  'English Setter',
  'English Springer Spaniel',
  'Flat-Coated Retriever',
  'French Bulldog',
  'German Shepherd Dog',
  'German Shorthaired Pointer',
  'Golden Retriever',
  'Gordon Setter',
  'Great Dane',
  'Great Pyrenees',
  'Greater Swiss Mountain Dog',
  'Havanese',
  'Ibizan Hound',
  'Irish Setter',
  'Irish Water Spaniel',
  'Irish Wolfhound',
  'Italian Greyhound',
  'Jack Russell Terrier',
  'Japanese Chin',
  'Keeshond',
  'Labrador Retriever',
  'Lhasa Apso',
  'Maltese',
  'Mastiff',
  'Miniature Bull Terrier',
  'Miniature Pinscher',
  'Miniature Schnauzer',
  'Neapolitan Mastiff',
  'Newfoundland',
  'Norfolk Terrier',
  'Norwegian Buhund',
  'Norwegian Elkhound',
  'Norwich Terrier',
  'Nova Scotia Duck Tolling Retriever',
  'Old English Sheepdog',
  'Papillon',
  'Pekingese',
  'Pembroke Welsh Corgi',
  'Pit Bull Terrier',
  'Pointer',
  'Pomeranian',
  'Poodle',
  'Portuguese Water Dog',
  'Pug',
  'Puli',
  'Rhodesian Ridgeback',
  'Rottweiler',
  'Saint Bernard',
  'Saluki',
  'Samoyed',
  'Schipperke',
  'Scottish Deerhound',
  'Scottish Terrier',
  'Shetland Sheepdog',
  'Shiba Inu',
  'Shih Tzu',
  'Siberian Husky',
  'Silky Terrier',
  'Skye Terrier',
  'Staffordshire Bull Terrier',
  'Standard Schnauzer',
  'Sussex Spaniel',
  'Tibetan Mastiff',
  'Tibetan Spaniel',
  'Tibetan Terrier',
  'Toy Fox Terrier',
  'Vizsla',
  'Weimaraner',
  'Welsh Terrier',
  'West Highland White Terrier',
  'Whippet',
  'Wire Fox Terrier',
  'Yorkshire Terrier',
];

let dogModal = $('#modal')
let ninjaApiInfo1 = $('.ninja-api-information1')
let ninjaApiInfo2 = $('.ninja-api-information2')
let modalCloseButton = $('.close-modal')
let favoritesArray = [];

// Initialization on document ready
$(function() {
  initializeDateInputs();
  populateBreedOptions();
});

// Initialize date inputs with current date
function initializeDateInputs() {
  let currentDate = new Date();
  let currentDateFormatted = dayjs(currentDate).format('YYYY-MM-DD');
  $('#start').attr('max', currentDateFormatted).attr('value', currentDateFormatted);
}

// Populate breed options in the select element
function populateBreedOptions() {
  const breedList = $('#breed');
  commonDogBreedsAlphabetical.forEach(breed => {
    breedList.append($('<option>').text(breed).attr('value', breed));
  });
}

//Adds functionality to the filter
$('.dog-form').on('submit', (event) => {
  event.preventDefault()

  $('.dog-cards').empty();

  //Gather form data
  let dogBreed = $('#breed').val();
  let dogSize = $('#size').val();
  let dogAge = $('#age').val();
  let dogGender = $('#gender').val();
  let dateString = dayjs($('#start').val()).add(1, 'day').format('YYYY-MM-DD')
  
  let date = new Date(dateString).toISOString();
  fetchDogs(dogSize, dogAge, dogGender, dogBreed, date)
})


//Fetches the token that is required for the api call
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



//Calls the petfinder api to give a list of dogs up for adoption
async function fetchDogs (size, age, gender, breed, date) {
  let token = await fetchToken();

  size = size || '';
  age = age || '';
  gender = gender || '';
  breed = breed || '';
  date = date || '';
  
  let url = `https://api.petfinder.com/v2/animals?type=dog&limit=100&size=${size}&age=${age}&gender=${gender}&breed=${breed}&before=${date}`

  let res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  let data = await res.json()
  createDogCards(data)
}

fetchDogs();






//Creates the dog cards to the page and adds a modal for each one
function createDogCards(dogs) {
  //Assigns the array of dogs from the API to a variable
  let dogArray = dogs.animals
  
  //Creates dog cards for the amount of dogs in the array that is fetched from petfinder API
  for (let i = 0; i<dogArray.length; ++i) {
    //Gets the .dog-cards div from the HTML and assigns it to dogCardDiv
    let dogCardDiv = $('.dog-cards');
    
    //Skips the dog if there is no photo associated with it
    if (dogArray[i].photos.length === 0) {
      continue
    }

    //Creates the card for the dog and assigns classes for formatting
    let dogCard = $('<div>').addClass('dog-card flex flex-col justify-center h-80 w-80')

    //Creates the image div within the dog card div and formats it
    let dogImageDiv = $('<div>').addClass('h-full overflow-hidden rounded-xl mr-2 ml-2')
    
    //Creates the image container, adds the photo of the dog from the array, and formats it
    let dogImage = $('<img>').attr('src', dogArray[i].photos[0].full).addClass('h-full w-full')
  
    //Appends the variables above to the respective containers
    dogCard.append(dogImageDiv)
    dogImageDiv.append(dogImage)
    dogCardDiv.append(dogCard)

    //Adds an event handler to the dog cards to open the modal
    dogCard.on('click', function() {
      //Hides the background when modal opens
      $('.main-container').removeClass('flex').addClass('hidden')
      $('.footer').addClass('hidden');
      $('.header').addClass('hidden');
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
      let id = dogArray[i].id

      //Resets NinjaAPI information
      ninjaApiInfo1.text('')
      ninjaApiInfo2.text('')

      //Adds dog name and description to the modal
      dogModalName.text(dogArray[i].name)
      dogModalDescription.text(dogArray[i].description)

      //Adds dog breed, age, email, phone, and published date to the modal
      dogBreed.text('').append(`${dogArray[i].breeds.primary}`)
      dogAge.text('').append(`${dogArray[i].age}`)
      email.text('').append(`${dogArray[i].contact.email}`)
      phone.text('').append(`${dogArray[i].contact.phone}`)
      dateAdded.text('').append(` Published on ${dayjs(dogArray[i].published_at).format('MM/DD/YYYY')}`)

      //Adds a photo of the dog to the modal
      dogModalImage.attr('src', dogArray[i].photos[0].full)

      favoritesDiv.empty();
      let favoritesButton = $('<button>').addClass('mr-10 p-2 border-2 border-zinc-900').text('Favorite')
      favoritesDiv.append(favoritesButton)

      if (favoritesArray.includes(id)) {
        favoritesButton.addClass('bg-yellow-600')
      }



      favoritesButton.on('click', function() {
        if (!favoritesArray.includes(id)) {
          favoritesArray.push(id);
          console.log(favoritesArray)

          favoritesButton.addClass('bg-yellow-600')
        } else if (favoritesArray.includes(id)) {
          let indexOfId = favoritesArray.indexOf(id)
          favoritesArray.splice(indexOfId, 1)
          console.log(favoritesArray)
          
          favoritesButton.removeClass('bg-yellow-600')
        }
      })
      




      //Fetchs the NinjaAPI information toa dd to the modal
      fetchDogInformation(dogArray[i].breeds.primary)

      //Shows the modal
      dogModal.show();
    })
  }  
}

//Closes modal when X button is pressed in top right of modal, as well as 
modalCloseButton.on('click', function() {
  dogModal.hide();

  //Unhides the content that was hidden from opening the modal
  $('.main-container').removeClass('hidden').addClass('flex')
  $('.footer').removeClass('hidden');
  $('.header').removeClass('hidden');
  $('body').removeClass('bg-sky-100')
  $('body').css('background-image', 'url("/assets/images/field-of-grass-1362858.jpg")');
})

//Closes modal when esc is pressed
$(document).keydown(function(event) {
  if (event.which == 27) {
      dogModal.hide(); 
      
      //Unhides the content that was hidden from opening the modal
      $('.main-container').removeClass('hidden').addClass('flex')
      $('.footer').removeClass('hidden');
      $('.header').removeClass('hidden');
      $('body').removeClass('bg-sky-100')
      $('body').css('background-image', 'url("/assets/images/field-of-grass-1362858.jpg")');
  } 
});


//Fetches the Ninja API
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



//Appends information from NinjaAPI to the modal
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






