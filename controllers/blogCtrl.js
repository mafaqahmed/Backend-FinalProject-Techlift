const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const { cloudinaryUploadImg } = require("../utils/cloudinary");
require("express-async-errors");
const validateMongoDbId = require("../utils/validateMongoDbId");
const fs = require('fs')

const createBlog = async (req, res) => {
  try {
    let newBlog = await Blog(req.body);
    newBlog.save();
    res.json(newBlog);
  } catch (error) {
    throw new Error(error);
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    let updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedBlog);
  } catch (error) {
    throw new Error(error);
  }
};

const getBlog = async (req, res) => {
  try {
    const { id } = req.params;
    // let getBlog = await Blog.findById(id)
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    res.json(updatedBlog);
  } catch (error) {
    throw new Error(error);
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    throw new Error(error);
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);
    res.json(deletedBlog);
  } catch (error) {
    throw new Error(error);
  }
};

const likeBlog = async (req, res) => {
  try {
    const { blogId } = req.body;
    const loginUserId = req.user._id;
    const blog = await Blog.findById(blogId);
    const isLiked = blog.isLiked;
    console.log(isLiked);
    const alreadyDisliked = await blog.dislikes.find(
      (userId) => userId.toString() === loginUserId.toString()
    );
    if (alreadyDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isdisLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    }
    if (isLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  } catch (error) {
    throw new Error(error);
  }
};

const dislikeBlog = async (req, res) => {
  try {
    const { blogId } = req.body;
    const loginUserId = req.user._id;
    const blog = await Blog.findById(blogId);
    const isdisLiked = blog.isdisLiked;
    const alreadyLiked = await blog.likes.find(
      (userId) => userId.toString() === loginUserId.toString()
    );
    if (alreadyLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    }
    if (isdisLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isdisLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { dislikes: loginUserId },
          isdisLiked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  } catch (error) {
    throw new Error(error);
  }
};

const uploadImage = async (req, res) => {
  let imgs = [];
  try {
    for (const file of req.files) {
      const { path } = file;
      const url = await cloudinaryUploadImg(path, "images");
      imgs.push(url);
    }
    const blogId = req.params.id;
    const blog = await Blog.findByIdAndUpdate(
      prodId,
      {
        images: imgs.map((img) => img),
      },
      { new: true }
    );
    res.json(blog);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlog,
  getAllBlogs,
  likeBlog,
  dislikeBlog,
  uploadImage
};
