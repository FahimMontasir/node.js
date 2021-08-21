const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.log("couldn't connected to mongo...", err));

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    // match: /pattern/
    lowercase: true,
    // uppercase: true,
    // trim: true,
  },
  category: {
    type: String,
    require: true,
    enum: ["web", "mobile", "network"], //category should be this type otherwise get error
  },
  author: String,
  tags: {
    //custom validation
    type: Array,
    // validate: {
    //   validator: function (value) {
    //     return value && value.length > 0;
    //   },
    //   message: "A course should have at least one tag",
    // },

    //async validator
    validate: {
      isAsync: true,
      validator: function (value, callback) {
        setTimeout(() => {
          //do async work
          const result = value && value.length > 0;
          callback(result);
        }, 3000);
      },
      message: "A course should have at least one tag",
    },
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
    min: 2,
    max: 10,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
  },
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
  const course = new Course({
    author: "maximilan",
    tags: [],
    category: "-",
    isPublished: true,
    // price: 15
  });

  try {
    const result = await course.save();
  } catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
  }
}

async function getCourses() {
  //comparison operator
  //eq (equal)
  //ne (not equal)
  //gt (grater than)
  //gte (grater than or equal)
  //lt (less than)
  //lte (less than or equal)
  //in
  //nin (not in)

  //logical operator
  //and or

  const pageNumber = 1;
  const pageSize = 10;
  // /api/courses?pageNumber=2&pageSize=10

  const courses = await Course.find({ author: "mosh", isPublished: true })
    // .find({ price: { $gte: 10, $lte: 20 } })
    // .find({ price: { $in: [15, 20, 25] } })
    //starts with Mosh(case sensitive)
    // .find({ author: /^Mosh/ })
    //end with Hamedani(case insensitive)
    // .find({ author: /Hamedani$/i })
    //contains Mosh
    // .find({ author: /.*Mosh.*/i })
    // .or([{ author: "Mosh" }, { isPublished: true }])
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ name: -1 });
  // .select({ name: 1, tags: 1 });
  // .countDocuments();
  console.log(courses);
}

async function updateCourse(id) {
  const course = await Course.findById(id);
  if (!course) return;

  course.set({
    isPublished: false,
    author: "another author",
  });

  const result = await course.save();
  console.log(result);
}

async function updateDirectly(id) {
  const course = await Course.findByIdAndUpdate(
    id,
    { $set: { author: "Dosh hamedani" } },
    { new: true }
  );
  console.log(course);
}

async function removeCourse(id) {
  // const course = await Course.deleteOne({_id:id});
  const course = await Course.findByIdAndRemove(id);
  console.log(course);
}

// removeCourse("610ba32800836e2a50bbd561");
// updateDirectly("610ba32800836e2a50bbd561");
// updateCourse("610ba32800836e2a50bbd561");
createCourse();
// getCourses();

//------------------modeling schema-----------------

//----referencing documents----
const Author = mongoose.model(
  "Author",
  new mongoose.Schema({
    name: String,
  })
);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
  })
);

//get courses with author
courses = await Course.find().populate("author", "name").select("name author");
//in populate 'author' is the field and 'name' is the author's value

//-----embedding documents-----
const authorSchema = new mongoose.Schema({
  name: String,
});
const Author = mongoose.model("Author", authorSchema);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,

    author: [authorSchema],
  })
);

async function createCourse(name, authors) {
  const course = new Course({
    name,
    authors,
  });
  course.save();
}
createCourse("node course", [
  new Author({ name: "mosh" }),
  new Author({ name: "hamedani" }),
]);

async function updateAuthor(courseId) {
  const course = await Course.updateOne(
    { _id: courseId },
    {
      $set: {
        "author.name": "fahim montasir",
      },
    }
  );
}

async function addAuthor(courseId, author) {
  const course = await Course.findById(courseId);
  course.author.push(author);
  course.save();
}
addAuthor("8937892kfskdjf859308", new Author({ name: "Amy" }));

async function removeAuthor(courseId, authorId) {
  const course = await Course.findById(courseId);
  const author = course.authors.id(authorId);
  author.remove();
  course.save();
}
removeAuthor("courseId", "authorId");
