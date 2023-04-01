"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
  if(currentUser) {
    putFavoriteStoriesOnPage();
    putMyStoriesOnPage();
  }
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName(story.url);
  return $(`
      <li id="${story.storyId}">
        <input class="story-favorite" type="checkbox" title="favorite story">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small><br>
        <small class="story-author">by ${story.author}</small><br>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
  return;
}

/** Gets list of stories from server, generates their HTML, and puts on page. 
 * TODO: Move favorite check and update to own function
*/

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $story.click(updateFavorites);
    
    // adds the story to favorite list if it has been favorited
    if(currentUser && currentUser.favorites.some(x => x.storyId === story.storyId)) {
      $story.find('.story-favorite').prop('checked', true).toggleClass('checked', true);
    }
    
    $allStoriesList.append($story);
  }
}
function putFavoriteStoriesOnPage() {
  console.debug("putFavoriteStoriesOnPage");

  $favoriteStoriesList.empty();

  // loop through all of our favorite stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $story.click(updateFavorites);
    $story.find('.story-favorite').prop('checked', true).toggleClass('checked', true);
    $favoriteStoriesList.append($story);
  }
}

function putMyStoriesOnPage() {
  console.debug("putMyStoriesOnPage");

   $myStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story);
    $story.prepend(`<span class="story-remove-icon"><i class="far fa-trash-alt"></i></span>`)
    $story.find('.story-favorite').click(updateFavorites);
    if(currentUser.favorites.some(x => x.storyId === story.storyId)) {
      $story.find('.story-favorite').prop('checked', true).toggleClass('checked', true);
    }
    $story.on("click", ".story-remove-icon", deleteOwnStoryClick);
    $myStoriesList.append($story);
  }
}


/** Gets new story input, submits to API, and puts on page. */

async function submitNewStoryStory(evt) {
  console.debug("newStory", evt);
  evt.preventDefault();

  // grab the title, author, and url
  const title = $("#newStory-title").val();
  const author = $("#newStory-author").val();
  const url = $("#newStory-url").val();

  // StoryList.addStory post story to API and then refreshes story list
  let story = await storyList.addStory(currentUser, {title, author, url});

  storyList.stories = [story,...storyList.stories];
  currentUser.ownStories = [story,...currentUser.ownStories];

  $submitForm.trigger("reset");
  $submitForm.hide();

  updateAllStoryLists();
}

$submitForm.on("submit", submitNewStoryStory);


async function updateFavorites(evt) {
  console.debug("favoriteStory", evt);
  //evt.preventDefault();
  const story = evt.target.parentElement;
  const isFavorited = evt.target.checked;
  let response;
  if(isFavorited) {
    await User.addStoryToFavorites(currentUser, story.id);
    
  }
  else {
   await User.removeStoryFromFavorties(currentUser, story.id);
  }
  updateAllStoryLists();
}

function noFavoritesMessage() {
  $favoriteStoriesList.append('<p>No favorites added!</p>')
}

function noOwnStoriesMessage() {
  $myStoriesList.append('<p>No stories added!</p>')
}


async function deleteOwnStoryClick(evt) {
  const id = evt.target.parentElement.parentElement.id;
  await User.deleteMyStory(currentUser, id);
  updateAllStoryLists();
}

function updateAllStoryLists() {
  putStoriesOnPage();
  putFavoriteStoriesOnPage();
  putMyStoriesOnPage();
}