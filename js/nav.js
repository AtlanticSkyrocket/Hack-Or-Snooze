"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  $allStoriesList.show();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show new story form, update story list */

function navSubmitClick(evt) {
  console.debug("navNewStorySubmit", evt);
  hidePageComponents();
  $submitForm.show();
  $allStoriesList.show();
}

$navSubmit.on("click", navSubmitClick);

/** Show my favorited stories */

function navFavoriteStories(evt) {
  console.debug("navFavoriteStories", evt);
  hidePageComponents();
  $favoriteStoriesList.show();
  if(currentUser.favorites.length === 0) {
    noFavoritesMessage();
  }
}

$('#nav-favorite-story').on("click", navFavoriteStories);

/** Show my story stories */

function navMyStories(evt) {
  console.debug("navMyStories", evt);
  hidePageComponents();
  $myStoriesList.show();
  if(currentUser.ownStories.length === 0) {
    noOwnStoriesMessage();
  }
}

$('#nav-my-story').on("click", navMyStories);