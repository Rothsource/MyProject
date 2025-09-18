import {InputLink, MaliciousLink, DetectLink} from "../model/Index.js" 
// Store submitted link
async function store_Link(link, hash, userId) {
  const newLink = await InputLink.create({
    links: link,
    hahs_url256: hash,
    Input_Link_Users: userId,
  });

  return {
    link_id: newLink.links_id,
    link,
    hash,
    userId,
  };
}

// Record detection
async function record_Detection(link_id, label, user_id, input_id) {
  await DetectLink.create({
    links_id: link_id,
    Detect_label: label,
    User_Id: user_id,
    input_links_id: input_id,
  });
}

export const createLink = async (req, res) => {
  try {
    const { links, hash } = req.body;

    if (!links) {
      return res.status(400).json({ error: 'Input link is required!' });
    }

    const id = req.user.sub;

    const newLink = await store_Link(links, hash, id);

    return res.status(201).json({
      success: true,
      link_id: newLink.link_id,
      message: 'Link created successfully',
    });
  } catch (error) {
    console.error('Error creating link:', error);
    res.status(500).json({ error: 'Failed to create link' });
  }
};

export const detectLink = async (req, res) => {
  try {
    let label = 'Good';
    const { hash, inputId } = req.body;

    if (!hash) {
      return res.status(400).json({ error: 'Link is required!' });
    }
    const userid = req.user.sub;
    const maliciousLink = await MaliciousLink.findOne({
      where: { hahs_256: hash },
    });
    

    if (maliciousLink && maliciousLink.is_bad === 'Bad') {
      label = 'Bad';
      await record_Detection(maliciousLink?.id || null, label, userid, inputId);
    }else{
      label = "Unknow";
    }

    return res.json({ label });
  } catch (error) {
    console.error('Error detecting link:', error);
    res.status(500).json({ error: 'Failed to detect link' });
  }
};
