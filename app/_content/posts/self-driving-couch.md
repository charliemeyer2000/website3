---
title: self-driving couch
visibility: public
shortUrl: couch
date: "2026-07-04"
---

# self-driving couch

We built a self-driving couch! This was the culmination of a semester of on-and-off work, taking a $5 couch from Goodwill, building a drivable frame around it, and wiring up vision, depth perception, and navigation into it.

In short, we stream data from a custom iPhone app (GPS, LiDAR, cameras) along with other telemetry data from our motors (IMU data) into a Jetson Orin Nano, which runs ROS 2. We created navigation nodes to plan a path with Nav2 and send commands to the motors. Additionally, we built a custom teleoperation interface to manually control the couch, bagging/backtesting infrastructure, and then made a couple of fun runs throughout Grounds for your viewing pleasure.

Also, I got pulled over (which was my goal in the first place!). Luckily, I got off with a warning, but the officer simply asked, "What is this?" to which I explained the project. He then said that he didn't know exactly _why_ what we're doing was illegal, but it definitely is illegal, so we should just get off the street (and we graciously obliged).

<video-carousel loop>
  <video-slide key="Self-Driving Couch/IMG_5336.mp4" title="cruising the Corner" aspect="9/16"></video-slide>
  <video-slide key="Self-Driving Couch/Self-Driving Run (Foxglove).mp4" title="autonomous run — nav2 path, LiDAR, and cameras in Foxglove" aspect="16/9"></video-slide>
  <video-slide key="Self-Driving Couch/IMG_4990.mp4" title="teleop testing in the parking garage" aspect="9/16"></video-slide>
  <video-slide key="Self-Driving Couch/IMG_9306 (1).mp4" title="graduation laps on the Lawn" aspect="9/16"></video-slide>
  <video-slide key="Self-Driving Couch/IMG_9313 (1).mp4" title="at the Rotunda" aspect="9/16"></video-slide>
</video-carousel>

## learnings

### working with people

Working on a hard (and in college, stupid/edgy) project is the best way to motivate smart people to work on something with you. Paradoxically, pitching a task that is way out of your depth is more likely to get takers than something that's easy or is well-defined.

While this is certainly beaten to death, the "pizza-sized team" often works well. While there were seven people in a group chat to coordinate work, effectively two people contributed to this project. Adding one extra contributor to a module/project doesn't necessarily correlate to adding one extra contributor's worth of value due to coordination overhead.

### first time building a (big-ish) physical thing

I have an incredible amount of respect for people who build physical things. Unlike software, the costs are much more tangible (money, part shipping time), and we aren't (yet) able to have Claude control a drill. Over the course of this project, we rebuilt our wooden frame three times, and had to iteratively improve on our message processing & communication protocols to ensure reliable operation. Moreover, the higher-quality your messaging and node organization is, the easier it is to backtest captured bags of a run, debug issues, and iterate.

## gallery

You can see all of the photos/videos from behind-the-scenes [here](https://photos.charliemeyer.xyz/Self-Driving%20Couch), including building, testing, and lots and lots of failures.

## links

- repo: [github.com/charliemeyer2000/couch-vision](https://github.com/charliemeyer2000/couch-vision)
- gallery: [photos.charliemeyer.xyz/Self-Driving Couch](https://photos.charliemeyer.xyz/Self-Driving%20Couch)
