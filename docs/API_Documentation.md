# API Documentation

## Quiz APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/quizzes/create | Create new quiz |
| GET | /api/quizzes | Get all quizzes |
| GET | /api/quizzes/:id | Get quiz by ID |

## AI APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/ai/generate-questions | Generate questions from topic |
| POST | /api/ai/generate-from-text | Generate from text content |

## Attempt APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/attempts/quiz/:quizId/start | Start quiz attempt |
| POST | /api/attempts/:attemptId/submit-answer | Submit answer |
