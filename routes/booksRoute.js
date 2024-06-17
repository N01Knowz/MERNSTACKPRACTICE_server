import express from "express";
import { Book } from "../models/bookModel.js";
import { check, validationResult } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (request, response) => {
  try {
    const books = await Book.find({});

    return response.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

router.post("/", async (request, response) => {
  try {
    const validationRules = [
      check("title").trim().notEmpty().withMessage("Title is required"),
      check("author").trim().notEmpty().withMessage("Author is required"),
      check("publishYear")
        .trim()
        .notEmpty()
        .withMessage("Publish year must be a number"),
    ];

    // Validate the request body
    await Promise.all(validationRules.map((rule) => rule.run(request)));

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
      const combinedErrors = validationErrors
        .array()
        .map((error) => error.msg)
        .join(". ");
      return response.status(400).json({ message: combinedErrors });
    }

    const newBook = {
      title: request.body.title,
      author: request.body.author,
      publishYear: request.body.publishYear,
    };

    const book = await Book.create(newBook);
    return response.status(201).send(book);
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const book = await Book.findById(id);

    return response.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

router.put("/:id", async (request, response) => {
  console.log(request.body);
  try {
    const validationRules = [
      check("title").trim().notEmpty().withMessage("Title is required"),
      check("author").trim().notEmpty().withMessage("Author is required"),
      check("publishYear").isInt().withMessage("Publish year must be a number"),
    ];

    // Validate the request body
    await Promise.all(validationRules.map((rule) => rule.run(request)));

    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
      const combinedErrors = validationErrors
        .array()
        .map((error) => error.msg)
        .join(". ");
      return response.status(400).json({ message: combinedErrors });
    }

    const { id } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).send({ message: "Invalid book ID format" });
    }
    const book = await Book.findByIdAndUpdate(id, request.body);
    if (!book) {
      return response.status(404).send({ message: "Book not found" });
    }
    return response.status(200).json({
      message: "Book Updated Successfully",
      data: book,
    });
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).send({ message: "Invalid book ID format" });
    }
    const book = await Book.findByIdAndDelete(id, request.body);
    if (!book) {
      return response.status(404).send({ message: "Book not found" });
    }
    return response.status(200).json({
      message: "Book Deleted Successfully",
      data: book,
    });
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: error.message });
  }
});

export default router;
