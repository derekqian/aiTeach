// Slides content: simple array of slide objects
const SLIDES = [
  {title: 'Welcome', body: 'Intro to Git & GitHub. Goals: track code, collaborate, and share projects.'},
  {title: 'What is Git?', body: 'Git is a version control system that keeps snapshots of your files over time.'},
  {title: 'What is GitHub?', body: 'GitHub is a cloud service that hosts git repositories and adds collaboration tools.'},
  {title: 'Basic Workflow', body: 'Edit files → git add → git commit → git push. We will simulate these steps.'},
  {title: 'Branches', body: 'Branches let you work on features separately. You can merge changes back.'},
  {title: 'Pull Requests', body: 'PRs are a way to ask others to review and merge your branch.'},
  {title: 'Class Activities', body: '1) Live demo with simulator 2) Student exercise repo 3) Pair programming to submit PRs.'}
];

// Student content (simplified HTML)
const STUDENT_GUIDE = `
<h3>Getting started</h3>
<ol>
  <li>Open the exercise folder and follow the steps in <code>exercises/README.md</code>.</li>
  <li>Make a change, commit locally, and record your commit message.</li>
  <li>Create a branch for your feature and push it to GitHub (teacher will provide class repo).</li>
  <li>Open a Pull Request and request a review from a teammate.</li>
</ol>
<h3>Resources</h3>
<ul>
  <li>A friendly Git cheatsheet: <code>git status</code>, <code>git add</code>, <code>git commit</code>, <code>git branch</code>, <code>git checkout</code>, <code>git merge</code></li>
  <li>Use the Simulator for practice in class.</li>
</ul>
`;

// Basic DOM wiring for slides
const slideContainer = document.getElementById('slideContainer');
const slideIndex = document.getElementById('slideIndex');
let currentSlide = 0;

function renderSlides(){
  slideContainer.innerHTML = '';
  SLIDES.forEach((s, i) => {
    const el = document.createElement('div');
    el.className = 'slide';
    el.innerHTML = `<h2>${s.title}</h2><p>${s.body}</p>`;
    slideContainer.appendChild(el);
  });
  updateSlideUI();
}

function updateSlideUI(){
  const offset = -currentSlide * 100;
  slideContainer.style.transform = `translateX(${offset}%)`;
  slideIndex.textContent = `${currentSlide+1} / ${SLIDES.length}`;
}

document.getElementById('prevSlide').addEventListener('click', ()=>{
  if(currentSlide>0) currentSlide -=1; updateSlideUI();
});
document.getElementById('nextSlide').addEventListener('click', ()=>{
  if(currentSlide<SLIDES.length-1) currentSlide +=1; updateSlideUI();
});

// Panel mode buttons
function showPanel(id){
  document.querySelectorAll('.panel').forEach(p=>p.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}
document.getElementById('modeSlides').addEventListener('click', ()=> showPanel('slides'));
document.getElementById('modeStudent').addEventListener('click', ()=> showPanel('student'));
document.getElementById('modeSim').addEventListener('click', ()=> showPanel('simulator'));

// Student guide
document.getElementById('studentContent').innerHTML = STUDENT_GUIDE;

// Simple in-memory git simulator model
class SimRepo{
  constructor(){ this.reset(); }
  reset(){
    this.branches = {main: []};
    this.current = 'main';
    this.log = ['Repository created. Current branch: main'];
    this.commitCount = 0;
  }
  commit(msg){
    this.commitCount +=1;
    const id = `c${this.commitCount}`;
    this.branches[this.current].push({id, msg});
    this.log.push(`Commit ${id} on ${this.current}: ${msg}`);
  }
  createBranch(name){
    if(this.branches[name]){ this.log.push(`Branch ${name} already exists`); return; }
    // copy history
    this.branches[name] = [...this.branches[this.current]];
    this.log.push(`Branch ${name} created from ${this.current}`);
  }
  checkout(name){
    if(!this.branches[name]){ this.log.push(`No such branch: ${name}`); return; }
    this.current = name;
    this.log.push(`Checked out ${name}`);
  }
  merge(from){
    if(!this.branches[from]){ this.log.push(`No such branch: ${from}`); return; }
    const target = this.current;
    const fromCommits = this.branches[from].filter(c=> !this.branches[target].some(t=>t.id===c.id));
    this.branches[target].push(...fromCommits);
    this.log.push(`Merged ${from} into ${target} (${fromCommits.length} commits)`);
  }
}

const repo = new SimRepo();
const repoView = document.getElementById('repoView');
const simLog = document.getElementById('simLog');

function renderRepo(){
  repoView.innerHTML = '';
  for(const b of Object.keys(repo.branches)){
    const box = document.createElement('div');
    box.style.marginBottom='12px';
    box.innerHTML = `<strong>${b}${b===repo.current? ' (current)':''}</strong>`;
    const ul = document.createElement('ul');
    for(const c of repo.branches[b]){
      const li = document.createElement('li'); li.textContent = `${c.id}: ${c.msg}`; ul.appendChild(li);
    }
    box.appendChild(ul);
    repoView.appendChild(box);
  }
  simLog.textContent = repo.log.join('\n');
}

document.getElementById('doCommit').addEventListener('click', ()=>{
  const msg = document.getElementById('commitMsg').value || `work ${Date.now()}`;
  repo.commit(msg);
  renderRepo();
});
document.getElementById('createBranch').addEventListener('click', ()=>{
  const name = document.getElementById('branchName').value.trim();
  if(!name) return alert('Enter branch name');
  repo.createBranch(name);
  renderRepo();
});
document.getElementById('checkoutBranch').addEventListener('click', ()=>{
  const name = document.getElementById('branchName').value.trim();
  if(!name) return alert('Enter branch name');
  repo.checkout(name);
  renderRepo();
});
document.getElementById('mergeBranch').addEventListener('click', ()=>{
  const name = document.getElementById('branchName').value.trim();
  if(!name) return alert('Enter branch name');
  repo.merge(name);
  renderRepo();
});
document.getElementById('resetRepo').addEventListener('click', ()=>{
  if(!confirm('Reset simulator?')) return;
  repo.reset(); renderRepo();
});

// init
renderSlides(); renderRepo();
