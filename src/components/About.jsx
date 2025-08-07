import "./styles/About.css";

export default function About() {
  return (
    <div className="about">
      <p className="about__text">
        This website is the final project of the Fullstack Developer course from
        Tripleten!
      </p>
      <p className="about__text">
        This is the website for those, who struggling about choising what to
        cook. And so projects name is "What to cook?"!
      </p>
      <p className="about__text">
        The idea is if you'll look into your kitchen and pick one ingridient,
        you'll get a list of recipes to cook with that ingridient.
      </p>
      <p className="about__text">
        Website powered by TheMealDB API, as I'm using their API for getting all
        recipes data.
      </p>
      <p className="about__text">
        If you're logged in, you can add recipe in favorites to ease further
        search of it!
      </p>
    </div>
  );
}
