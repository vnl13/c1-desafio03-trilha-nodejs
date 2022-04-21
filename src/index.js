const express = require('express');

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repo = repositories.find((repository) => repository.id === id);

  if (!repo) {
    return response.status(404).json({ error: 'Repository not found.' });
  }

  const updatedRepository = {
    ...repo,
    title,
    url,
    techs,
  };

  return response.json(updatedRepository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repository = repositories.find((repository) => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  repositories.splice(repositories.indexOf(repository), 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repository = repositories.find((repository) => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: 'Repository not found.' });
  }

  repositories.map((repository) =>
    repository.id === id
      ? { ...repository, likes: repository.likes++ }
      : repository
  );

  const updatedRepository = repositories.find(
    (repository) => repository.id === id
  );

  return response.json({ likes: updatedRepository.likes });
});

module.exports = app;
