var express = require('express');
var router = express.Router();

router.get('/', async (req, res, next) => {

  try {
    const response = await fetch(
      'https://api.tvmaze.com/shows?page=0'
    );

    if (!response.ok) {
      throw new Error('Failed to fetch TV shows');
    }

    const data = await response.json();

    res.render('index', { shows: data });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
});

router.post('/search', async (req, res) => {
  try {
    const query = req.body.query;

    const url = new URL('https://api.tvmaze.com/search/shows');
    url.searchParams.set('q', query);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('TVmaze API request failed');
    }

    const shows = await response.json();

    res.render('search', {
      shows,
      query
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Unable to search shows');
  }
});

router.get('/shows/:id', async (req, res) => {
  try {
    const response = await fetch(
      `https://api.tvmaze.com/shows/${req.params.id}`
    );

    if (!response.ok) {
      return res.status(404).send('Show not found');
    }

    const show = await response.json();

    const response2 = await fetch(
      `https://api.tvmaze.com/shows/${req.params.id}/episodes`
    );

    const episodes = await response2.json();

    const episodesBySeason = episodes.reduce((groups, episode) => {
      const season = episode.season;

      if (!groups[season]) {
        groups[season] = [];
      }

      groups[season].push(episode);

      return groups;
    }, {});

    const response3 = await fetch(
  `https://api.tvmaze.com/shows/${req.params.id}/cast`
);

const cast = await response3.json();

const response4 = await fetch(
  `https://api.tvmaze.com/shows/${req.params.id}/images`
);

const images = await response4.json();

const imageUrls = images
  .map(image =>
    image.resolutions?.original?.url ||
    image.resolutions?.medium?.url
  )
  .filter(Boolean);

    res.render('show', {
      show, episodesBySeason,cast,imageUrls
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Unable to load show');
  }

})
module.exports = router;
